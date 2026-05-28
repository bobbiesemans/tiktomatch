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
import { PLANS } from "@/lib/stripe"
import { Check, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const schema = z.object({
  bedrijfsnaam: z.string().min(2),
  website: z.string().url().optional().or(z.literal("")),
  beschrijving: z.string().optional(),
  btw_nummer: z.string().optional(),
})
type FormData = z.infer<typeof schema>

export default function BrandInstellingenPage() {
  const [tier, setTier] = useState("free")
  const [upgradeLoading, setUpgradeLoading] = useState<string | null>(null)

  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    async function laad() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const [{ data: brand }, { data: profile }] = await Promise.all([
        supabase.from("brands").select("*").eq("id", user.id).single(),
        supabase.from("profiles").select("subscription_tier").eq("id", user.id).single(),
      ])
      if (brand) reset({ bedrijfsnaam: brand.bedrijfsnaam, website: brand.website ?? "", beschrijving: brand.beschrijving ?? "", btw_nummer: brand.btw_nummer ?? "" })
      if (profile) setTier(profile.subscription_tier)
    }
    laad()
  }, [reset])

  async function onSubmit(data: FormData) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from("brands").upsert({ id: user.id, ...data })
    if (error) toast.error("Opslaan mislukt")
    else toast.success("Profiel opgeslagen")
  }

  async function handleUpgrade(plan: string) {
    setUpgradeLoading(plan)
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    })
    const d = await res.json()
    if (d.url) window.location.href = d.url
    else { toast.error("Checkout mislukt"); setUpgradeLoading(null) }
  }

  return (
    <div className="max-w-3xl space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Instellingen</h1>

      <Card>
        <CardHeader><CardTitle>Brand profiel</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Bedrijfsnaam</Label>
                <Input className="mt-1" {...register("bedrijfsnaam")} />
                {errors.bedrijfsnaam && <p className="text-red-500 text-xs mt-1">{errors.bedrijfsnaam.message}</p>}
              </div>
              <div>
                <Label>Website</Label>
                <Input className="mt-1" placeholder="https://" {...register("website")} />
              </div>
            </div>
            <div>
              <Label>Beschrijving</Label>
              <Textarea className="mt-1" rows={3} {...register("beschrijving")} />
            </div>
            <div>
              <Label>BTW-nummer</Label>
              <Input className="mt-1" placeholder="BE0123456789" {...register("btw_nummer")} />
            </div>
            <Button type="submit" className="bg-[#1a0533] hover:bg-[#2d0955]" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Opslaan...</> : "Profiel opslaan"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Abonnement</CardTitle>
          <p className="text-sm text-gray-500">Huidig plan: <span className="font-semibold capitalize text-[#1a0533]">{tier}</span></p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {(Object.entries(PLANS) as [string, typeof PLANS[keyof typeof PLANS]][]).map(([key, plan]) => (
              <div key={key} className={cn("rounded-xl border-2 p-4", tier === plan.tier ? "border-[#ff0050] bg-red-50" : "border-gray-200")}>
                <p className="font-bold text-gray-900">{plan.naam}</p>
                <p className="text-2xl font-extrabold text-gray-900 my-2">€{plan.prijs}<span className="text-sm font-normal text-gray-500">/mnd</span></p>
                <ul className="space-y-1 mb-4">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-1.5 text-xs text-gray-600">
                      <Check className="h-3 w-3 text-green-500" />{f}
                    </li>
                  ))}
                </ul>
                {tier === plan.tier ? (
                  <Button variant="secondary" size="sm" className="w-full" disabled>Huidig plan</Button>
                ) : (
                  <Button size="sm" className="w-full bg-[#ff0050] hover:bg-[#ff337a]" onClick={() => handleUpgrade(key)} disabled={upgradeLoading === key}>
                    {upgradeLoading === key ? <Loader2 className="h-3 w-3 animate-spin" /> : "Upgraden"}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
