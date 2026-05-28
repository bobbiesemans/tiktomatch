# TikToMatch

AI-powered matching platform voor TikTok creators en Belgische brands.

## Tech stack

- **Next.js 14** (App Router)
- **Supabase** (auth + database + RLS)
- **Tailwind CSS**
- **TypeScript**
- **Claude claude-sonnet-4-6** (AI matching engine)

## Setup

### 1. Supabase project aanmaken

1. Ga naar [supabase.com](https://supabase.com) → nieuw project
2. Kopieer de Project URL en anon key
3. Voer de migration uit: plak inhoud van `supabase/migrations/001_initial_schema.sql` in de Supabase SQL Editor

### 2. Google OAuth configureren (optioneel)

In Supabase Dashboard → Authentication → Providers → Google:
- Client ID en Secret van Google Cloud Console
- Redirect URL: `https://jouwproject.supabase.co/auth/v1/callback`

### 3. Omgevingsvariabelen

```bash
cp .env.local.example .env.local
```

Vul in:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Dev server starten

```bash
npm run dev
```

Open http://localhost:3000

## Structuur

```
src/
├── app/
│   ├── auth/
│   │   ├── login/          # Email/wachtwoord login
│   │   ├── register/       # Registratie + user type keuze
│   │   ├── callback/       # OAuth callback handler
│   │   ├── signout/        # Uitloggen
│   │   └── verify-email/   # Bevestigingspagina
│   ├── dashboard/          # Beveiligd dashboard
│   └── api/
│       └── matches/
│           └── generate/   # POST: genereer AI matches
├── lib/
│   ├── supabase/
│   │   ├── client.ts       # Browser client
│   │   └── server.ts       # Server client
│   └── ai/
│       └── matching.ts     # Claude matching engine
├── middleware.ts            # Auth redirects
└── types/
    └── database.ts         # TypeScript types
supabase/
└── migrations/
    └── 001_initial_schema.sql
```

## AI Matching Engine

De `berekenAIScore()` functie stuurt creator + brand data naar Claude en ontvangt:

- **Score** (0-100) op basis van 5 criteria
- **Uitleg** in het Nederlands
- **Sterke punten** van de match
- **Aandachtspunten**

Scoring criteria:
| Criterium | Punten |
|-----------|--------|
| Niche-product alignment | 30 |
| Engagement kwaliteit | 20 |
| Verkoopkapaciteit (GMV) | 20 |
| Demografische match | 15 |
| Budget fit | 10 |
| Taal & regio | 5 |

## Database schema

- `profiles` — user type (brand/creator), auto-aangemaakt via trigger
- `creators` — TikTok stats, engagement, GMV, niches
- `brands` — bedrijfsinfo, budget, doelgroep, campagne type
- `matches` — AI score, uitleg, status (pending/accepted/rejected/completed)

RLS zorgt dat brands **alleen eigen data** zien.
