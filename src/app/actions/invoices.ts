"use server"

import { createClient } from "@/lib/supabase/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function nextInvoiceNumber(admin: any): Promise<string> {
  const year = new Date().getFullYear()
  const { count } = await admin
    .from("invoices")
    .select("*", { count: "exact", head: true })
  const seq = (count ?? 0) + 1001
  return `TM-${year}-${String(seq).padStart(4, "0")}`
}

export async function generateInvoice(campagneId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Niet ingelogd" }

  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: campagne } = await supabase
    .from("campagnes")
    .select("*, brands(bedrijfsnaam, btw_nummer)")
    .eq("id", campagneId)
    .eq("brand_id", user.id)
    .single()

  if (!campagne) return { error: "Campagne niet gevonden" }
  if (campagne.invoice_id) return { error: "Factuur bestaat al" }

  const invoiceNum = await nextInvoiceNumber(admin)
  const subtotaal = campagne.budget ?? 0
  const btwBedrag = Math.round(subtotaal * 0.21 * 100) / 100
  const totaal = subtotaal + btwBedrag

  const { data: invoice, error } = await admin.from("invoices").insert({
    brand_id: user.id,
    campagne_id: campagneId,
    invoice_number: invoiceNum,
    omschrijving: `Campagne: ${campagne.naam}`,
    subtotaal,
    btw_percentage: 21,
    btw_bedrag: btwBedrag,
    totaal,
    status: "open",
    vervaldatum: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  }).select().single()

  if (error) return { error: error.message }

  await admin.from("campagnes").update({ invoice_id: invoice.id }).eq("id", campagneId)

  revalidatePath("/dashboard/brand/facturen")
  return { success: true, invoice }
}

export async function markInvoicePaid(invoiceId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Niet ingelogd" }

  const { error } = await supabase
    .from("invoices")
    .update({ status: "betaald", betaald_op: new Date().toISOString() })
    .eq("id", invoiceId)
    .eq("brand_id", user.id)

  if (error) return { error: error.message }
  revalidatePath("/dashboard/brand/facturen")
  return { success: true }
}
