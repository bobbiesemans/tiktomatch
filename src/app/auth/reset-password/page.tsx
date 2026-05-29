"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, ArrowLeft, CheckCircle } from "lucide-react"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/update-password`,
    })

    setLoading(false)
    if (error) {
      setError("Er ging iets mis. Controleer je e-mailadres en probeer opnieuw.")
    } else {
      setSent(true)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Branding links */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1a0533] flex-col justify-between p-12">
        <div>
          <span className="text-2xl font-extrabold text-white">Tikto<span className="text-[#ff0050]">Match</span></span>
        </div>
        <div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Wachtwoord vergeten?
          </h2>
          <p className="text-white/60 text-lg">
            Geen probleem. We sturen je een resetlink op je e-mailadres.
          </p>
        </div>
        <p className="text-white/30 text-sm">© 2025 TikToMatch</p>
      </div>

      {/* Formulier rechts */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <Link href="/auth/login" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-8">
            <ArrowLeft className="h-4 w-4" /> Terug naar inloggen
          </Link>

          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">E-mail verstuurd</h1>
              <p className="text-gray-500 text-sm mb-6">
                Controleer je inbox op <strong>{email}</strong> en klik op de resetlink.
              </p>
              <p className="text-xs text-gray-400">Geen e-mail ontvangen? Controleer je spam-map of probeer opnieuw.</p>
              <Button variant="outline" className="mt-4 w-full" onClick={() => setSent(false)}>
                Opnieuw versturen
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Wachtwoord resetten</h1>
                <p className="text-gray-500 text-sm">Vul je e-mailadres in en we sturen je een resetlink.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">E-mailadres</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="jij@bedrijf.be"
                    className="mt-1"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full bg-[#1a0533] hover:bg-[#2d0955]" disabled={loading || !email}>
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Versturen...</> : "Resetlink versturen"}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
