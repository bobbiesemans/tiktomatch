import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatEuro } from "@/lib/utils"
import { BarChart2, ExternalLink } from "lucide-react"

const statusBadge: Record<string, { label: string; variant: "success" | "warning" | "secondary" }> = {
  actief: { label: "Actief", variant: "success" },
  concept: { label: "Concept", variant: "secondary" },
  gepauzeerd: { label: "Gepauzeerd", variant: "warning" },
  voltooid: { label: "Voltooid", variant: "secondary" },
}

export default async function CreatorCampagnesPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: campagnes } = await supabase
    .from("campagnes")
    .select("*, brands(bedrijfsnaam)")
    .eq("creator_id", user.id)
    .order("created_at", { ascending: false })

  const tabs = ["alle", "actief", "concept", "voltooid"]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mijn campagnes</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <BarChart2 className="h-4 w-4" />
          {campagnes?.length ?? 0} totaal
        </div>
      </div>

      <Tabs defaultValue="alle">
        <TabsList className="mb-6">
          {tabs.map((t) => <TabsTrigger key={t} value={t} className="capitalize">{t}</TabsTrigger>)}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab} value={tab}>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {["Brand", "Campagne", "Type", "Periode", "Clicks", "Conversies", "Omzet", "Commissie", "Status", ""].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(campagnes ?? [])
                    .filter((c) => tab === "alle" || c.status === tab)
                    .map((c) => {
                      const brand = c.brands as { bedrijfsnaam: string } | null
                      const b = statusBadge[c.status] ?? { label: c.status, variant: "secondary" as const }
                      const periode = c.start_datum
                        ? `${c.start_datum}${c.eind_datum ? ` – ${c.eind_datum}` : ""}`
                        : "—"
                      return (
                        <tr key={c.id} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-3 font-medium text-gray-900">{brand?.bedrijfsnaam || "—"}</td>
                          <td className="px-4 py-3 font-medium text-gray-900">{c.naam}</td>
                          <td className="px-4 py-3"><Badge variant="secondary">{c.campagne_type}</Badge></td>
                          <td className="px-4 py-3 text-gray-500 text-xs">{periode}</td>
                          <td className="px-4 py-3 text-gray-900">{(c.clicks ?? 0).toLocaleString("nl-BE")}</td>
                          <td className="px-4 py-3 text-gray-900">{(c.conversies ?? 0).toLocaleString("nl-BE")}</td>
                          <td className="px-4 py-3 font-medium text-gray-900">{formatEuro(c.omzet ?? 0)}</td>
                          <td className="px-4 py-3 text-green-600 font-medium">{formatEuro(c.commissie_earned ?? 0)}</td>
                          <td className="px-4 py-3"><Badge variant={b.variant}>{b.label}</Badge></td>
                          <td className="px-4 py-3">
                            {c.affiliate_link && (
                              <a href={c.affiliate_link} target="_blank" rel="noopener noreferrer"
                                className="p-1.5 text-gray-400 hover:text-gray-700 transition inline-flex">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  {(campagnes ?? []).filter((c) => tab === "alle" || c.status === tab).length === 0 && (
                    <tr>
                      <td colSpan={10} className="text-center py-12 text-gray-400">
                        Geen campagnes in deze categorie
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
