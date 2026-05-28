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
import { Loader2, LogOut, Shield, User } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const accountSchema = z.object({
  full_name: z.string().min(2, "Verplicht"),
  email: z.string().email("Ongeldig e-mailadres"),
})

const wachtwoordSchema = z.object({
  nieuw: z.string().min(8, "Minimaal 8 tekens"),
  bevestig: z.string(),
}).refine((d) => d.nieuw === d.bevestig, { message: "Wachtwoorden komen niet overeen", path: ["bevestig"] })

type AccountData = z.infer<typeof accountSchema>
type WachtwoordData = z.infer<typeof wachtwoordSchema>

export default function CreatorInstellingenPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")

  const { register: regAcc, handleSubmit: handleAcc, reset: resetAcc, formState: { isSubmitting: subAcc, errors: errAcc } } = useForm<AccountData>({
    resolver: zodResolver(accountSchema),
  })

  const { register: regPw, handleSubmit: handlePw, reset: resetPw, formState: { isSubmitting: subPw, errors: errPw } } = useForm<WachtwoordData>({
    resolver: zodResolver(wachtwoordSchema),
  })

  useEffect(() => {
    async function laad() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setEmail(user.email ?? "")
      const { data: profile } = await supabase.from("profiles").select("full_name, email").eq("id", user.id).single()
      if (profile) {
        resetAcc({ full_name: profile.full_name ?? "", email: profile.email ?? user.email ?? "" })
      }
    }
    laad()
  }, [resetAcc])

  async function onAccount(data: AccountData) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from("profiles").update({ full_name: data.full_name }).eq("id", user.id)
    if (data.email !== email) {
      await supabase.auth.updateUser({ email: data.email })
      toast.success("Bevestigingsmail verstuurd naar nieuw e-mailadres")
    } else if (!error) {
      toast.success("Profiel opgeslagen")
    } else {
      toast.error("Opslaan mislukt")
    }
  }

  async function onWachtwoord(data: WachtwoordData) {
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: data.nieuw })
    if (error) toast.error("Wachtwoord wijzigen mislukt")
    else { toast.success("Wachtwoord gewijzigd"); resetPw() }
  }

  async function uitloggen() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Instellingen</h1>

      {/* Account */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAcc(onAccount)} className="space-y-4">
            <div>
              <Label>Naam</Label>
              <Input className="mt-1" {...regAcc("full_name")} />
              {errAcc.full_name && <p className="text-red-500 text-xs mt-1">{errAcc.full_name.message}</p>}
            </div>
            <div>
              <Label>E-mailadres</Label>
              <Input className="mt-1" type="email" {...regAcc("email")} />
              {errAcc.email && <p className="text-red-500 text-xs mt-1">{errAcc.email.message}</p>}
              <p className="text-xs text-gray-400 mt-1">Wijzigen stuurt een bevestigingsmail</p>
            </div>
            <Button type="submit" className="bg-[#ff0050] hover:bg-[#ff337a]" disabled={subAcc}>
              {subAcc ? <><Loader2 className="h-4 w-4 animate-spin" /> Opslaan...</> : "Opslaan"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Wachtwoord */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Wachtwoord wijzigen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePw(onWachtwoord)} className="space-y-4">
            <div>
              <Label>Nieuw wachtwoord</Label>
              <Input className="mt-1" type="password" {...regPw("nieuw")} />
              {errPw.nieuw && <p className="text-red-500 text-xs mt-1">{errPw.nieuw.message}</p>}
            </div>
            <div>
              <Label>Bevestig wachtwoord</Label>
              <Input className="mt-1" type="password" {...regPw("bevestig")} />
              {errPw.bevestig && <p className="text-red-500 text-xs mt-1">{errPw.bevestig.message}</p>}
            </div>
            <Button type="submit" variant="outline" disabled={subPw}>
              {subPw ? <><Loader2 className="h-4 w-4 animate-spin" /> Opslaan...</> : "Wachtwoord wijzigen"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Uitloggen */}
      <Card>
        <CardContent className="p-5 flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-900 text-sm">Uitloggen</p>
            <p className="text-xs text-gray-500 mt-0.5">Je wordt teruggestuurd naar de loginpagina</p>
          </div>
          <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" onClick={uitloggen}>
            <LogOut className="h-4 w-4 mr-2" />
            Uitloggen
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
