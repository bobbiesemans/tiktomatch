-- ============================================================
-- TikToMatch — Subscriptions, waitlist & uitbetalingen
-- ============================================================

CREATE TYPE subscription_plan AS ENUM ('starter', 'pro', 'agency');
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'past_due', 'trialing');
CREATE TYPE payout_status AS ENUM ('pending', 'paid', 'failed');

-- ============================================================
-- BRAND SUBSCRIPTIONS
-- ============================================================
CREATE TABLE brand_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  stripe_subscription_id TEXT UNIQUE,
  plan subscription_plan NOT NULL DEFAULT 'starter',
  status subscription_status NOT NULL DEFAULT 'trialing',
  huidige_periode_start TIMESTAMPTZ,
  huidige_periode_einde TIMESTAMPTZ,
  actieve_campagnes INTEGER NOT NULL DEFAULT 0,
  matches_deze_maand INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(brand_id)
);

-- ============================================================
-- CREATOR STRIPE CONNECT
-- ============================================================
CREATE TABLE creator_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID REFERENCES creators(id) ON DELETE CASCADE NOT NULL UNIQUE,
  stripe_account_id TEXT UNIQUE,
  onboarding_voltooid BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- COMMISSIE / UITBETALINGEN
-- ============================================================
CREATE TABLE uitbetalingen (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID REFERENCES creators(id) ON DELETE CASCADE NOT NULL,
  match_id UUID REFERENCES matches(id) ON DELETE SET NULL,
  bruto_bedrag NUMERIC(10,2) NOT NULL,
  platform_commissie NUMERIC(10,2) NOT NULL,
  netto_bedrag NUMERIC(10,2) NOT NULL,
  stripe_transfer_id TEXT,
  status payout_status NOT NULL DEFAULT 'pending',
  uitbetaald_op TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- WAITLIST
-- ============================================================
CREATE TABLE waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  user_type user_type NOT NULL DEFAULT 'brand',
  bedrijfsnaam TEXT,
  tiktok_handle TEXT,
  utm_source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- RLS
-- ============================================================
ALTER TABLE brand_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE uitbetalingen ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sub_select_own" ON brand_subscriptions
  FOR SELECT USING (brand_id IN (SELECT id FROM brands WHERE user_id = auth.uid()));

CREATE POLICY "creator_payments_own" ON creator_payments
  FOR SELECT USING (creator_id IN (SELECT id FROM creators WHERE user_id = auth.uid()));

CREATE POLICY "uitbetalingen_own" ON uitbetalingen
  FOR SELECT USING (creator_id IN (SELECT id FROM creators WHERE user_id = auth.uid()));

-- Waitlist: iedereen kan inserten, niemand kan lezen (alleen service role)
CREATE POLICY "waitlist_insert" ON waitlist
  FOR INSERT WITH CHECK (true);

-- Updated at triggers
CREATE TRIGGER brand_subscriptions_updated_at
  BEFORE UPDATE ON brand_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER creator_payments_updated_at
  BEFORE UPDATE ON creator_payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
