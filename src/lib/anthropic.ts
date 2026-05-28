import Anthropic from "@anthropic-ai/sdk"

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export interface MatchScores {
  niche: number      // 0-30
  engagement: number // 0-20
  verkoop: number    // 0-20
  demografie: number // 0-15
  budget: number     // 0-10
  taal: number       // 0-5
}

export interface MatchAnalysis {
  totaal_score: number
  scores: MatchScores
  sterke_punten: string[]
  risicos: string[]
  aanbeveling: string
  campagne_type: "affiliate" | "gifting" | "paid"
}

export async function berekenMatch(
  brand: Record<string, unknown>,
  creator: Record<string, unknown>
): Promise<MatchAnalysis> {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1000,
    system: `Je bent het TikToMatch AI-algoritme voor de Belgische markt.
Analyseer de fit tussen een brand en TikTok creator.
Antwoord ALLEEN met valide JSON, geen uitleg erbuiten.`,
    messages: [
      {
        role: "user",
        content: `Analyseer deze match en geef een score.

BRAND:
${JSON.stringify(brand, null, 2)}

CREATOR:
${JSON.stringify(creator, null, 2)}

Geef exact dit JSON formaat terug:
{
  "totaal_score": <0-100>,
  "scores": {
    "niche": <0-30>,
    "engagement": <0-20>,
    "verkoop": <0-20>,
    "demografie": <0-15>,
    "budget": <0-10>,
    "taal": <0-5>
  },
  "sterke_punten": ["<max 3 punten in het Nederlands>"],
  "risicos": ["<max 2 risicos in het Nederlands>"],
  "aanbeveling": "<1 zin in het Nederlands>",
  "campagne_type": "<affiliate|gifting|paid>"
}`,
      },
    ],
  })

  const text = message.content[0].type === "text" ? message.content[0].text : ""
  return JSON.parse(text) as MatchAnalysis
}
