"use client"
export const dynamic = "force-dynamic"

import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { createClient } from "@/lib/supabase/client"
import type { SupabaseClient } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Video, Loader2, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

const schema = z.object({
  full_name: z.string().min(2, "Naam is verplicht"),
  email: z.string().email("Ongeldig e-mailadres"),
  password: z.string().min(8, "Minimaal 8 tekens"),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, {
  message: "Wachtwoorden komen niet overeen",
  path: ["confirm"],
})
type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const [stap, setStap] = useState<1 | 2>(1)
  const [userType, setUserType] = useState<"brand" | "creator" | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)
  const supabaseRef = useRef<SupabaseClient | null>(null)
  const router = useRouter()

  function sb() {
    if (!supabaseRef.current) supabaseRef.current = createClient()
    return supabaseRef.current
  }

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    if (!userType) return
    setServerError(null)
    const { error } = await sb().auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { user_type: userType, full_name: data.full_name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      setServerError(error.message === "User already registered" ? "Dit e-mailadres is al in gebruik." : error.message)
      return
    }
    router.push(`/auth/onboarding/${userType}`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex text-2xl font-extrabold">
            <span className="text-[#1a0533]">Tikto</span><span className="text-[#ff0050]">Match</span>
          </Link>
          <p className="text-gray-500 text-sm mt-1">Maak gratis je account aan</p>
        </div>

        {stap === 1 && (
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-4 text-center">Ik ben een...</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {([
                { type: "brand" as const, label: "Brand", sub: "Ik wil creators vinden", Icon: Building2 },
                { type: "creator" as const, label: "Creator", sub: "Ik wil deals ontvangen", Icon: Video },
              ]).map(({ type, label, sub, Icon }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setUserType(type)}
                  className={cn(
                    "p-5 rounded-xl border-2 text-left transition-all",
                    userType === type ? "border-[#ff0050] bg-red-50" : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <Icon className={cn("h-7 w-7 mb-2", userType === type ? "text-[#ff0050]" : "text-gray-400")} />
                  <p className="font-semibold text-gray-900">{label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
                </button>
              ))}
            </div>
            <Button
              className="w-full bg-[#1a0533] hover:bg-[#2d0955]"
              disabled={!userType}
              onClick={() => setStap(2)}
            >
              Volgende
            </Button>
          </div>
        )}

        {stap === 2 && (
          <div>
            <button onClick={() => setStap(1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-5 transition">
              <ArrowLeft className="h-4 w-4" /> Terug
            </button>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="full_name">{userType === "brand" ? "Jouw naam" : "Jouw naam"}</Label>
                <Input id="full_name" placeholder="Jan Janssen" className="mt-1" {...register("full_name")} />
                {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>}
              </div>
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" placeholder="jij@bedrijf.be" className="mt-1" {...register("email")} />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <Label htmlFor="password">Wachtwoord</Label>
                <Input id="password" type="password" placeholder="Min. 8 tekens" className="mt-1" {...register("password")} />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>
              <div>
                <Label htmlFor="confirm">Bevestig wachtwoord</Label>
                <Input id="confirm" type="password" placeholder="Herhaal wachtwoord" className="mt-1" {...register("confirm")} />
                {errors.confirm && <p className="text-red-500 text-xs mt-1">{errors.confirm.message}</p>}
              </div>

              {serverError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{serverError}</div>
              )}

              <Button type="submit" className="w-full bg-[#1a0533] hover:bg-[#2d0955]" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Account aanmaken...</> : "Account aanmaken"}
              </Button>
            </form>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-6">
          Al een account?{" "}
          <Link href="/auth/login" className="text-[#1a0533] font-semibold hover:underline">Inloggen</Link>
        </p>
      </div>
    </div>
  )
}
