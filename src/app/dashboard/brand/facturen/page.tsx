import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatEuro } from "@/lib/utils"
import { FileText, Download, CheckCircle, Clock, AlertCircle } from "lucide-react"

export const dynamic = "force-dynamic"

interface Invoice {
  id: string
  invoice_number: string
  omschrijving: string
  subtotaal: number
  btw_bedrag: number
  totaal: number
  status: string
  vervaldatum: string | null
  betaald_op: string | null
  created_at: string
  campagnes: { naam: string } | null
}

const statusConfig = {
  open: { label: "Openstaand", icon: Clock, color: "text-amber-600", bg: "bg-amber-50", variant: "warning" as const },
  betaald: { label: "Betaald", icon: CheckCircle, color: "text-green-600", bg: "bg-green-50", variant: "success" as const },
  vervallen: { label: "Vervallen", icon: AlertCircle, color: "text-red-600", bg: "bg-red-50", variant: "destructive" as const },
}

export default async function BrandFacturenPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data } = await supabase
    .from("invoices")
    .select("*, campagnes(naam)")
    .eq("brand_id", user.id)
    .order("created_at", { ascending: false })

  const invoices = (data ?? []) as Invoice[]

  const totaalOpen = invoices.filter((i) => i.status === "open").reduce((s, i) => s + i.totaal, 0)
  const totaalBetaald = invoices.filter((i) => i.status === "betaald").reduce((s, i) => s + i.totaal, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Facturen</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Openstaand</p>
              <p className="text-2xl font-bold text-gray-900">{formatEuro(totaalOpen)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Betaald</p>
              <p className="text-2xl font-bold text-gray-900">{formatEuro(totaalBetaald)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Totaal facturen</p>
              <p className="text-2xl font-bold text-gray-900">{invoices.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Facturen tabel */}
      <Card>
        <CardHeader>
          <CardTitle>Alle facturen</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {["Factuurnummer", "Omschrijving", "Datum", "Vervaldatum", "Subtotaal", "BTW 21%", "Totaal", "Status", ""].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoices.length === 0 && (
                  <tr>
                    <td colSpan={9} className="text-center py-12 text-gray-400">
                      Nog geen facturen. Facturen worden automatisch gegenereerd bij campagne-start.
                    </td>
                  </tr>
                )}
                {invoices.map((inv) => {
                  const s = statusConfig[inv.status as keyof typeof statusConfig] ?? statusConfig.open
                  const StatusIcon = s.icon
                  return (
                    <tr key={inv.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 font-mono text-sm font-semibold text-gray-900">{inv.invoice_number}</td>
                      <td className="px-4 py-3 text-gray-700 max-w-xs truncate">{inv.omschrijving}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {new Date(inv.created_at).toLocaleDateString("nl-BE")}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {inv.vervaldatum ? new Date(inv.vervaldatum).toLocaleDateString("nl-BE") : "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{formatEuro(inv.subtotaal)}</td>
                      <td className="px-4 py-3 text-gray-500">{formatEuro(inv.btw_bedrag ?? 0)}</td>
                      <td className="px-4 py-3 font-bold text-gray-900">{formatEuro(inv.totaal)}</td>
                      <td className="px-4 py-3">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.bg} ${s.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {s.label}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          className="p-1.5 text-gray-400 hover:text-gray-700 transition"
                          title="Download factuur"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Info box */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700 flex items-start gap-3">
        <FileText className="h-5 w-5 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold mb-1">Automatische facturatie</p>
          <p className="text-blue-600 text-xs">Facturen worden automatisch aangemaakt wanneer een campagne wordt geactiveerd. Betaling via Stripe is beschikbaar zodra je Stripe-integratie is geconfigureerd. Neem contact op via <a href="mailto:info@tiktomatch.be" className="underline">info@tiktomatch.be</a> voor vragen.</p>
        </div>
      </div>
    </div>
  )
}
