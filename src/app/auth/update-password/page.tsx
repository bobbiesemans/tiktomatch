"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle, Eye, EyeOff } from "lucide-react"

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Supabase exchanges the OTP from the URL hash automatically
    const supabase = createClient()
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true)
    })
    // Also mark ready if user already has a session (PKCE flow)
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true)
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) { setError("Wachtwoorden komen niet overeen."); return }
    if (password.length < 8) { setError("Wachtwoord moet minimaal 8 tekens zijn."); return }

    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (error) {
      setError("Kon wachtwoord niet updaten. Probeer de resetlink opnieuw aan te vragen.")
    } else {
      setDone(true)
      setTimeout(() => router.push("/auth/login"), 2500)
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-[#1a0533] flex-col justify-between p-12">
        <div>
          <span className="text-2xl font-extrabold text-white">Tikto<span className="text-[#ff0050]">Match</span></span>
        </div>
        <div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">Nieuw wachtwoord instellen</h2>
          <p className="text-white/60 text-lg">Kies een sterk wachtwoord van minimaal 8 tekens.</p>
        </div>
        <p className="text-white/30 text-sm">© 2026 TikToMatch</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {done ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Wachtwoord gewijzigd</h1>
              <p className="text-gray-500 text-sm">Je wordt doorgestuurd naar de loginpagina...</p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Nieuw wachtwoord</h1>
                <p className="text-gray-500 text-sm">Kies een nieuw wachtwoord voor je account.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="password">Nieuw wachtwoord</Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      type={showPw ? "text" : "password"}
                      placeholder="Minimaal 8 tekens"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirm">Bevestig wachtwoord</Label>
                  <Input
                    id="confirm"
                    type={showPw ? "text" : "password"}
                    placeholder="Herhaal wachtwoord"
                    className="mt-1"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                  />
                </div>

                {/* Sterkte indicator */}
                {password.length > 0 && (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      {[1,2,3,4].map((i) => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                          password.length >= i * 3
                            ? i <= 1 ? "bg-red-400" : i <= 2 ? "bg-yellow-400" : i <= 3 ? "bg-blue-400" : "bg-green-400"
                            : "bg-gray-200"
                        }`} />
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">
                      {password.length < 4 ? "Te kort" : password.length < 7 ? "Zwak" : password.length < 10 ? "Goed" : "Sterk"}
                    </p>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-[#1a0533] hover:bg-[#2d0955]"
                  disabled={loading || !ready || !password || !confirm}
                >
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Opslaan...</> : "Wachtwoord opslaan"}
                </Button>

                {!ready && (
                  <p className="text-xs text-center text-gray-400">Link wordt geverifieerd...</p>
                )}
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
