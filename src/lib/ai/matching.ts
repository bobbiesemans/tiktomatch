import Anthropic from '@anthropic-ai/sdk'
import type { Creator, Brand } from '@/types/database'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export interface MatchResult {
  score: number
  uitleg: string
  sterke_punten: string[]
  aandachtspunten: string[]
}

export async function berekenAIScore(
  creator: Creator,
  brand: Brand
): Promise<MatchResult> {
  const prompt = `Je bent een expert in TikTok marketing en influencer matchmaking voor de Belgische markt.

Analyseer de match tussen deze creator en dit brand en geef een score van 0 tot 100.

## CREATOR PROFIEL
- TikTok handle: @${creator.tiktok_handle}
- Volgers: ${creator.follower_count.toLocaleString('nl-BE')}
- Gem. engagement rate: ${creator.avg_engagement_rate}%
- Gem. views per video: ${creator.avg_views.toLocaleString('nl-BE')}
- Niches: ${creator.niches.join(', ')}
- Taal: ${creator.taal === 'both' ? 'NL & FR' : creator.taal.toUpperCase()}
- Provincie: ${creator.provincie}
- Verified seller (TikTok Shop): ${creator.verified_seller ? 'Ja' : 'Nee'}
- GMV laatste 30 dagen: €${creator.gmv_30d.toLocaleString('nl-BE')}
- Bio: ${creator.bio || 'Niet opgegeven'}

## BRAND PROFIEL
- Bedrijf: ${brand.bedrijfsnaam}
- Website: ${brand.website || 'Niet opgegeven'}
- Product categorieën: ${brand.product_categorieen.join(', ')}
- Budget per creator: €${brand.budget_min} - €${brand.budget_max}
- Doelgroep leeftijd: ${brand.doelgroep_leeftijd || 'Niet opgegeven'}
- Doelgroep geslacht: ${brand.doelgroep_geslacht || 'Niet opgegeven'}
- Campagne type: ${brand.campagne_type}

## OPDRACHT
Geef een JSON response met exact dit formaat:
{
  "score": <getal 0-100>,
  "uitleg": "<2-3 zinnen samenvatting van de match>",
  "sterke_punten": ["<punt 1>", "<punt 2>", "<punt 3>"],
  "aandachtspunten": ["<punt 1>", "<punt 2>"]
}

Scoring criteria (totaal 100 punten):
- Niche-product alignment (30 punten): Hoe goed matchen de niches met de producten?
- Engagement kwaliteit (20 punten): Engagement rate + views t.o.v. volgers
- Verkoopkapaciteit (20 punten): GMV, verified seller status
- Demografische match (15 punten): Leeftijd/geslacht doelgroep
- Budget fit (10 punten): Ligt de creator binnen het budget?
- Taal & regio fit (5 punten): Taal en provincie matchen

Geef ALLEEN de JSON terug, geen extra tekst.`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  })

  const content = message.content[0]
  if (content.type !== 'text') {
    throw new Error('Onverwacht response type van Claude')
  }

  const result = JSON.parse(content.text) as MatchResult
  return result
}

export async function genereerTopMatches(
  brand: Brand,
  creators: Creator[],
  topN = 10
): Promise<Array<{ creator: Creator; match: MatchResult }>> {
  const resultaten = await Promise.all(
    creators.map(async (creator) => {
      const match = await berekenAIScore(creator, brand)
      return { creator, match }
    })
  )

  return resultaten
    .sort((a, b) => b.match.score - a.match.score)
    .slice(0, topN)
}
