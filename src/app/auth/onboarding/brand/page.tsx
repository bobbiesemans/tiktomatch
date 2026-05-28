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
import { NICHES, cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

const STAPPEN = ["Bedrijf", "Producten", "Doelgroep", "Budget"]

const stap1Schema = z.object({
  bedrijfsnaam: z.string().min(2, "Verplicht"),
  website: z.string().url("Ongeldige URL").optional().or(z.literal("")),
  beschrijving: z.string().optional(),
})
type Stap1 = z.infer<typeof stap1Schema>

export default function BrandOnboardingPage() {
  const [stap, setStap] = useState(0)
  const [niches, setNiches] = useState<string[]>([])
  const [geslacht, setGeslacht] = useState("all")
  const [budgetMin, setBudgetMin] = useState(100)
  const [budgetMax, setBudgetMax] = useState(1000)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const { register, handleSubmit, getValues, formState: { errors } } = useForm<Stap1>({
    resolver: zodResolver(stap1Schema),
  })

  function toggleNiche(n: string) {
    setNiches((prev) => prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n])
  }

  async function voltooi() {
    setLoading(true)
    const vals = getValues()
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push("/auth/login"); return }

    await supabase.from("brands").upsert({
      id: user.id,
      bedrijfsnaam: vals.bedrijfsnaam,
      website: vals.website || null,
      beschrijving: vals.beschrijving || null,
      product_categorieen: niches,
      doelgroep_geslacht: geslacht,
      budget_min: budgetMin,
      budget_max: budgetMax,
    })
    router.push("/dashboard/brand")
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
          <form onSubmit={handleSubmit(() => setStap(1))} className="space-y-4">
            <div>
              <Label>Bedrijfsnaam *</Label>
              <Input placeholder="ACME BV" className="mt-1" {...register("bedrijfsnaam")} />
              {errors.bedrijfsnaam && <p className="text-red-500 text-xs mt-1">{errors.bedrijfsnaam.message}</p>}
            </div>
            <div>
              <Label>Website</Label>
              <Input placeholder="https://jouwbedrijf.be" className="mt-1" {...register("website")} />
              {errors.website && <p className="text-red-500 text-xs mt-1">{errors.website.message}</p>}
            </div>
            <div>
              <Label>Omschrijving</Label>
              <Textarea placeholder="Vertel iets over je merk en producten..." className="mt-1" {...register("beschrijving")} />
            </div>
            <Button type="submit" className="w-full bg-[#1a0533] hover:bg-[#2d0955]">Volgende</Button>
          </form>
        )}

        {stap === 1 && (
          <div>
            <p className="text-sm text-gray-500 mb-4">Kies de productcategorieën die je verkoopt</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {NICHES.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => toggleNiche(n)}
                  className={cn("px-4 py-2 rounded-full text-sm font-medium transition-all",
                    niches.includes(n) ? "bg-[#ff0050] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStap(0)} className="flex-1">Terug</Button>
              <Button className="flex-1 bg-[#1a0533] hover:bg-[#2d0955]" disabled={niches.length === 0} onClick={() => setStap(2)}>Volgende</Button>
            </div>
          </div>
        )}

        {stap === 2 && (
          <div className="space-y-5">
            <div>
              <Label className="mb-2 block">Doelgroep geslacht</Label>
              <div className="flex gap-3">
                {[{ v: "all", l: "Alle" }, { v: "female", l: "Vrouw" }, { v: "male", l: "Man" }].map(({ v, l }) => (
                  <button key={v} type="button" onClick={() => setGeslacht(v)}
                    className={cn("flex-1 py-2 rounded-lg border-2 text-sm font-medium transition",
                      geslacht === v ? "border-[#ff0050] bg-red-50 text-[#ff0050]" : "border-gray-200 text-gray-600"
                    )}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStap(1)} className="flex-1">Terug</Button>
              <Button className="flex-1 bg-[#1a0533] hover:bg-[#2d0955]" onClick={() => setStap(3)}>Volgende</Button>
            </div>
          </div>
        )}

        {stap === 3 && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Min. budget (€/campagne)</Label>
                <Input type="number" value={budgetMin} onChange={(e) => setBudgetMin(Number(e.target.value))} className="mt-1" />
              </div>
              <div>
                <Label>Max. budget (€/campagne)</Label>
                <Input type="number" value={budgetMax} onChange={(e) => setBudgetMax(Number(e.target.value))} className="mt-1" />
              </div>
            </div>
            <div className="bg-[#1a0533]/5 rounded-xl p-4 text-sm text-gray-600">
              Budget range: <strong className="text-gray-900">€{budgetMin} – €{budgetMax}</strong> per campagne
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
