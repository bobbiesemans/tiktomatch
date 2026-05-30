import Link from "next/link"

export default function VoorwaardenPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 py-4 px-6">
        <Link href="/" className="text-xl font-extrabold">
          <span className="text-[#1a0533]">Tikto</span><span className="text-[#ff0050]">Match</span>
        </Link>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Algemene Voorwaarden</h1>
        <p className="text-gray-500 mb-8">Laatste update: 1 juni 2026 — TikToMatch BV, België</p>

        <div className="prose prose-gray max-w-none space-y-8">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Definities</h2>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><strong>TikToMatch:</strong> het platform dat wordt aangeboden door TikToMatch BV, een onderneming naar Belgisch recht.</li>
              <li><strong>Brand:</strong> een bedrijf of ondernemer die gebruik maakt van het platform om creators te vinden.</li>
              <li><strong>Creator:</strong> een TikTok-gebruiker die zich registreert om campagnes te ontvangen.</li>
              <li><strong>Match:</strong> een AI-gegenereerde koppeling tussen een brand en een creator.</li>
              <li><strong>Campagne:</strong> een samenwerkingsopdracht tussen een brand en creator, beheerd via het platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Platform & Toepassingsgebied</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              TikToMatch biedt een B2B SaaS-platform aan dat brands en TikTok creators koppelt via AI-matching op basis van verkoopdata, engagement en nichecompatibiliteit. Het platform is uitsluitend actief in België.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed mt-2">
              Door gebruik te maken van TikToMatch aanvaard je deze voorwaarden en ga je een overeenkomst aan met TikToMatch BV. Deze voorwaarden zijn van toepassing op alle gebruikers van het platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Platform-Only Communicatie</h2>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800 mb-3">
              <strong>Belangrijk:</strong> Alle communicatie tussen brands en creators verloopt uitsluitend via het TikToMatch-platform.
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Het is ten strengste verboden om via TikToMatch gevonden contacten rechtstreeks te benaderen buiten het platform om. Dit omvat maar is niet beperkt tot: het uitwisselen van persoonlijke contactgegevens (e-mail, telefoon, sociale media), het sluiten van overeenkomsten buiten het platform, en het omzeilen van de platformcommissie.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed mt-2">
              Bij vaststelling van een overtreding kan TikToMatch een <strong>schadevergoeding van €500 per geval</strong> vorderen, bovenop eventuele misgelopen platformfees. Het account wordt onmiddellijk opgeschort.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Toegang & Tarieven (Brands)</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              TikToMatch werkt met <strong>tarieven op maat</strong> voor merken en bedrijven. Er zijn geen vaste publieke abonnementsprijzen. Na registratie en het invullen van een brandprofiel neemt TikToMatch <strong>binnen 24 uur</strong> persoonlijk contact op om de toegang en het toepasselijke tarief te bespreken.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed mt-2">
              TikToMatch behoudt het recht om registraties te weigeren of toegang te beperken. Toegang wordt pas verleend na expliciete goedkeuring door TikToMatch. De tarieven zijn gebaseerd op het commissiemodel (percentage van gerealiseerde verkopen via het platform) en/of een vaste platformvergoeding, afhankelijk van het profiel en de sector van de klant.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed mt-2">
              Alle tarieven worden vastgelegd in een individuele overeenkomst. Wijzigingen worden minimaal 30 dagen vooraf gecommuniceerd. Alle tarieven zijn excl. BTW.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Platformfee & Commissie (Creators)</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              TikToMatch rekent een <strong>platformfee van 20% op de creator-commissie</strong>. De creator-commissie wordt bepaald door het merk (typisch 5–30% van de verkoopprijs, afhankelijk van productcategorie). TikToMatch houdt 20% van dit commissiebedrag in als platformfee. De creator ontvangt de resterende 80% van de commissie.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed mt-2">
              <strong>Voorbeeld:</strong> Product verkoopprijs €49,99 × 10% commissie (€5,00) − 20% platformfee (€1,00) = <strong>€4,00 netto voor de creator</strong> per verkoop.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed mt-2">
              Uitbetaling volgt <strong>15 dagen na bevestigde levering</strong> van de bestelling aan de eindconsument, conform het TikTok Shop uitbetalingsmodel. Een minimumdrempel van €50 is van toepassing voor uitbetaling. TikToMatch is niet aansprakelijk voor vertragingen door het TikTok Shop-platform, terugbetalingen of bancaire instellingen.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed mt-2">
              Merken betalen daarnaast rechtstreeks aan TikTok Shop een referral fee van 9% op de verkoopprijs (4% gedurende de eerste 60 dagen voor nieuwe verkopers). Deze fee is verschuldigd aan TikTok, niet aan TikToMatch.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Content & Intellectuele Eigendom</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Creators behouden te allen tijde de intellectuele eigendomsrechten op hun content. Door een campagne te accepteren, verleent de creator een niet-exclusieve, beperkte licentie aan de brand om de content te gebruiken voor de overeengekomen campagnedoeleinden en duur. Het is de brand niet toegestaan content te hergebruiken buiten de campagneperiode zonder schriftelijke toestemming van de creator.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Reclameregels & Transparantie</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Alle gesponsorde content moet duidelijk worden gelabeld als &quot;#gesponsord&quot;, &quot;#advertentie&quot; of &quot;#samenwerking&quot; conform de Belgische Jury voor Ethische Praktijken inzake reclame (JEP) en de Europese richtlijn over oneerlijke handelspraktijken. TikToMatch is niet aansprakelijk voor schendingen van reclameregels door creators of brands.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Annulering & Opschorting</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              TikToMatch behoudt het recht om accounts op te schorten of te verwijderen bij schending van deze voorwaarden, zonder opgave van reden, met onmiddellijke ingang. Openstaande betalingen blijven verschuldigd. Creators die een campagne annuleren na 48 uur na acceptatie, kunnen een verwerkingsvergoeding van €50 opgelegd krijgen.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Aansprakelijkheid</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              TikToMatch treedt op als tussenpersoon en is niet aansprakelijk voor de kwaliteit van campagnes, de betrouwbaarheid van creators of brands, of de gerealiseerde omzet. De totale aansprakelijkheid van TikToMatch is beperkt tot het bedrag dat de gebruiker in de voorafgaande 3 maanden heeft betaald.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Toepasselijk recht</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Deze voorwaarden zijn onderworpen aan het Belgisch recht. Geschillen worden beslecht door de bevoegde rechtbanken van Antwerpen, België.
            </p>
          </section>

          <section className="bg-gray-50 rounded-xl p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Contact</h2>
            <p className="text-gray-600 text-sm">TikToMatch BV — <a href="mailto:legal@tiktomatch.be" className="text-[#ff0050] hover:underline">legal@tiktomatch.be</a></p>
          </section>
        </div>
      </div>
    </div>
  )
}
