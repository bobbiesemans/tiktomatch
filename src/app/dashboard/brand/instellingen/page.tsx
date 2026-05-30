"use client"
export const dynamic = "force-dynamic"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Check, Loader2 } from "lucide-react"
import { toast } from "sonner"

const schema = z.object({
  bedrijfsnaam: z.string().min(2),
  website: z.string().url().optional().or(z.literal("")),
  beschrijving: z.string().optional(),
  btw_nummer: z.string().optional(),
})
type FormData = z.infer<typeof schema>

export default function BrandInstellingenPage() {
  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    async function laad() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: brand } = await supabase.from("brands").select("*").eq("id", user.id).single()
      if (brand) reset({ bedrijfsnaam: brand.bedrijfsnaam, website: brand.website ?? "", beschrijving: brand.beschrijving ?? "", btw_nummer: brand.btw_nummer ?? "" })
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
          <CardTitle>Toegang & tarieven</CardTitle>
          <p className="text-sm text-gray-500">Tarieven worden op maat bepaald na persoonlijk contact</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-[#1a0533]/5 border border-[#1a0533]/15 rounded-xl">
            <div className="w-10 h-10 bg-[#1a0533] rounded-xl flex items-center justify-center shrink-0">
              <Check className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Jouw aanvraag is ontvangen</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                Ons team bekijkt je profiel en neemt <strong>binnen 24 uur</strong> contact met je op via e-mail om je toegang en tarieven te bespreken.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: "🎯", t: "AI-matching op maat", d: "Op basis van jouw producten, commissie% en doelgroep" },
              { icon: "💳", t: "Commissie-gebaseerd", d: "Enkel betalen als er verkocht wordt via creators" },
              { icon: "📞", t: "Persoonlijk contact", d: "Een medewerker begeleidt je bij het opstarten" },
            ].map(({ icon, t, d }) => (
              <div key={t} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-2xl block mb-2">{icon}</span>
                <p className="font-semibold text-gray-900 text-sm mb-1">{t}</p>
                <p className="text-xs text-gray-500">{d}</p>
              </div>
            ))}
          </div>

          <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
            <p className="text-sm text-amber-800">
              Vragen over toegang of tarieven?
              Mail naar <a href="mailto:info@tiktomatch.be" className="font-semibold underline">info@tiktomatch.be</a> of
              bel <a href="tel:+32" className="font-semibold underline">+32 (contact volgt binnenkort)</a>.
              We nemen sowieso zelf contact op binnen 24u na registratie.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
