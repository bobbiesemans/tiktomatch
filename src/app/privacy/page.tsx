import Link from "next/link"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 py-4 px-6">
        <Link href="/" className="text-xl font-extrabold">
          <span className="text-[#1a0533]">Tikto</span><span className="text-[#ff0050]">Match</span>
        </Link>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacybeleid</h1>
        <p className="text-gray-500 mb-8">Laatste update: 1 juni 2026 — TikToMatch BV, België</p>

        <div className="space-y-8 text-sm text-gray-600 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Wie zijn wij?</h2>
            <p>TikToMatch BV is een Belgisch bedrijf dat een AI-matching platform aanbiedt voor TikTok creators en brands. Wij zijn de verwerkingsverantwoordelijke voor jouw persoonsgegevens in de zin van de AVG (GDPR).</p>
            <p className="mt-2">Contact: <a href="mailto:privacy@tiktomatch.be" className="text-[#ff0050] hover:underline">privacy@tiktomatch.be</a></p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Welke gegevens verzamelen wij?</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Voor alle gebruikers:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>E-mailadres en naam (bij registratie)</li>
                  <li>IP-adres en apparaatinformatie (technisch noodzakelijk)</li>
                  <li>Communicatie via het platform (berichten)</li>
                  <li>Betalingsinformatie (verwerkt door Stripe — wij slaan geen kaartgegevens op)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Voor creators:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>TikTok-handle en publiek profielgegevens</li>
                  <li>Volgersaantal, engagement rate, GMV-data</li>
                  <li>Niche-categorieën en taalvoorkeur</li>
                  <li>Bankgegevens voor uitbetaling (verwerkt via Stripe Connect)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Voor brands:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Bedrijfsnaam, BTW-nummer, website</li>
                  <li>Campagnebudget en -doelstellingen</li>
                  <li>Factuurgegevens</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Waarom verwerken wij jouw gegevens?</h2>
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 font-semibold text-gray-700">Doel</th>
                  <th className="text-left px-4 py-2 font-semibold text-gray-700">Rechtsgrond</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  ["Platformdiensten leveren", "Contractuele noodzaak"],
                  ["AI-matching berekeningen", "Contractuele noodzaak"],
                  ["Betalingen verwerken", "Contractuele noodzaak"],
                  ["Communicatie via platform", "Contractuele noodzaak"],
                  ["Facturatie", "Wettelijke verplichting"],
                  ["Platform verbeteren", "Legitiem belang"],
                  ["Marketing (nieuwsbrief)", "Toestemming"],
                ].map(([doel, grond]) => (
                  <tr key={doel}>
                    <td className="px-4 py-2">{doel}</td>
                    <td className="px-4 py-2 text-gray-500">{grond}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Met wie delen wij jouw gegevens?</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Stripe:</strong> voor betalingsverwerking en creator-uitbetalingen</li>
              <li><strong>Supabase:</strong> voor database-hosting (servers in EU)</li>
              <li><strong>Anthropic:</strong> geanonimiseerde profieldata voor AI-matching (geen persoonsgegevens)</li>
              <li><strong>Vercel:</strong> voor hosting van het platform (servers in EU)</li>
            </ul>
            <p className="mt-3">Wij verkopen nooit jouw gegevens aan derden. Alle verwerkers zijn AVG-compliant en er is een verwerkersovereenkomst afgesloten.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Hoe lang bewaren wij jouw gegevens?</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Accountgegevens: zolang je account actief is + 2 jaar na verwijdering</li>
              <li>Facturen en betalingsdata: 7 jaar (wettelijke boekhoudverplichting)</li>
              <li>Berichten: 2 jaar na laatste activiteit</li>
              <li>Campagnedata: 3 jaar voor analytische doeleinden</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Jouw rechten</h2>
            <p>Als betrokkene heb je het recht op:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Inzage:</strong> opvragen welke gegevens wij over jou hebben</li>
              <li><strong>Rectificatie:</strong> onjuiste gegevens laten corrigeren</li>
              <li><strong>Verwijdering:</strong> je account en gegevens laten verwijderen</li>
              <li><strong>Overdraagbaarheid:</strong> jouw gegevens in een gestructureerd formaat ontvangen</li>
              <li><strong>Bezwaar:</strong> bezwaar maken tegen verwerking op basis van legitiem belang</li>
            </ul>
            <p className="mt-3">Stuur een verzoek naar <a href="mailto:privacy@tiktomatch.be" className="text-[#ff0050] hover:underline">privacy@tiktomatch.be</a>. Wij reageren binnen 30 dagen.</p>
            <p className="mt-2">Je kan ook een klacht indienen bij de <a href="https://www.gegevensbeschermingsautoriteit.be" target="_blank" className="text-[#ff0050] hover:underline">Gegevensbeschermingsautoriteit (GBA)</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Cookies</h2>
            <p>TikToMatch gebruikt minimale, technisch noodzakelijke cookies voor authenticatie (sessie-cookies via Supabase). Wij gebruiken geen tracking- of advertentiecookies van derden.</p>
          </section>

          <section className="bg-gray-50 rounded-xl p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Contact DPO</h2>
            <p>TikToMatch BV — <a href="mailto:privacy@tiktomatch.be" className="text-[#ff0050] hover:underline">privacy@tiktomatch.be</a></p>
          </section>
        </div>
      </div>
    </div>
  )
}
