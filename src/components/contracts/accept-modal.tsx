"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileText, CheckCircle, Shield, AlertTriangle } from "lucide-react"

interface Props {
  matchId: string
  brandName: string
  campagneType: string | null
  onAccepted: (matchId: string) => void
  onCancelled: () => void
}

export function ContractModal({ matchId, brandName, campagneType, onAccepted, onCancelled }: Props) {
  const [accepted, setAccepted] = useState(false)
  const [accepted2, setAccepted2] = useState(false)

  const canProceed = accepted && accepted2

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onCancelled}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Samenwerkingsovereenkomst</h2>
              <p className="text-sm text-gray-500">Lees en accepteer voor je verder gaat</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Contract samenvatting */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-purple-600 mt-0.5 shrink-0" />
              <p><strong>Platform-only communicatie:</strong> Alle communicatie met {brandName} verloopt uitsluitend via TikToMatch. Directe contactgegevens delen is verboden en kan leiden tot uitsluiting.</p>
            </div>
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-purple-600 mt-0.5 shrink-0" />
              <p><strong>Commissie & uitbetaling:</strong> TikToMatch houdt 20% in op jouw verdiende commissie als platformfee. Uitbetaling volgt <strong>15 dagen na bevestigde levering</strong> aan de klant — conform TikTok Shop-standaard. Minimum uitbetaling: €50.</p>
            </div>
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-purple-600 mt-0.5 shrink-0" />
              <p><strong>Content richtlijnen:</strong> Content moet voldoen aan de briefing van {brandName}, de TikTok Community Guidelines en Belgische reclameregels (JEP).</p>
            </div>
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-purple-600 mt-0.5 shrink-0" />
              <p><strong>Campagnetype:</strong> <span className="font-semibold capitalize">{campagneType ?? "Affiliate"}</span> — de exacte details en deliverables worden bevestigd via de chat.</p>
            </div>
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
              <p><strong>Annulering:</strong> Eenmaal geaccepteerd ben je gebonden aan de campagne. Annulering binnen 48u is mogelijk; daarna kan TikToMatch een boete van €50 aanrekenen.</p>
            </div>
          </div>

          {/* Checkboxes */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <div
              onClick={() => setAccepted(!accepted)}
              className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                accepted ? "bg-[#ff0050] border-[#ff0050]" : "border-gray-300 group-hover:border-[#ff0050]"
              }`}
            >
              {accepted && <CheckCircle className="h-3 w-3 text-white" />}
            </div>
            <p className="text-sm text-gray-700">
              Ik begrijp dat alle communicatie <strong>uitsluitend via TikToMatch</strong> verloopt en dat ik geen persoonlijke contactgegevens mag uitwisselen.
            </p>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group">
            <div
              onClick={() => setAccepted2(!accepted2)}
              className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                accepted2 ? "bg-[#ff0050] border-[#ff0050]" : "border-gray-300 group-hover:border-[#ff0050]"
              }`}
            >
              {accepted2 && <CheckCircle className="h-3 w-3 text-white" />}
            </div>
            <p className="text-sm text-gray-700">
              Ik ga akkoord met de{" "}
              <a href="/voorwaarden" target="_blank" className="text-[#ff0050] underline">algemene voorwaarden</a>{" "}
              en het{" "}
              <a href="/privacy" target="_blank" className="text-[#ff0050] underline">privacybeleid</a>{" "}
              van TikToMatch.
            </p>
          </label>
        </div>

        <div className="p-6 border-t border-gray-100 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onCancelled}>
            Annuleren
          </Button>
          <Button
            className="flex-1 bg-[#ff0050] hover:bg-[#ff337a]"
            disabled={!canProceed}
            onClick={() => onAccepted(matchId)}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Accepteren & akkoord
          </Button>
        </div>
      </div>
    </div>
  )
}
