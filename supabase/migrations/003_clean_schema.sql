-- ============================================================
-- TikToMatch v2 — Definitief schema (drop & recreate)
-- Gebruik dit als ENIGE migration op een nieuw Supabase project
-- ============================================================

-- Enums
DO $$ BEGIN
  CREATE TYPE user_type_enum AS ENUM ('brand', 'creator');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE subscription_tier_enum AS ENUM ('free', 'starter', 'pro', 'agency');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE match_status_enum AS ENUM ('pending', 'accepted', 'rejected', 'completed', 'expired');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE campagne_status_enum AS ENUM ('concept', 'actief', 'gepauzeerd', 'voltooid');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE campagne_type_enum AS ENUM ('affiliate', 'gifting', 'paid');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  user_type TEXT CHECK (user_type IN ('brand', 'creator')),
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'starter', 'pro', 'agency')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, user_type, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'creator'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- BRANDS
-- ============================================================
CREATE TABLE IF NOT EXISTS brands (
  id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  bedrijfsnaam TEXT NOT NULL DEFAULT '',
  website TEXT,
  beschrijving TEXT,
  product_categorieen TEXT[] DEFAULT '{}',
  budget_min INTEGER DEFAULT 0,
  budget_max INTEGER DEFAULT 1000,
  doelgroep_leeftijd_min INTEGER DEFAULT 18,
  doelgroep_leeftijd_max INTEGER DEFAULT 45,
  doelgroep_geslacht TEXT DEFAULT 'all' CHECK (doelgroep_geslacht IN ('male', 'female', 'all')),
  doelgroep_regio TEXT DEFAULT 'belgie',
  campagne_types TEXT[] DEFAULT '{}',
  btw_nummer TEXT,
  logo_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CREATORS
-- ============================================================
CREATE TABLE IF NOT EXISTS creators (
  id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  tiktok_handle TEXT UNIQUE,
  display_name TEXT,
  bio TEXT,
  follower_count INTEGER DEFAULT 0,
  avg_engagement_rate NUMERIC(5,2) DEFAULT 0,
  avg_views INTEGER DEFAULT 0,
  gmv_30d NUMERIC(10,2) DEFAULT 0,
  verified_seller BOOLEAN DEFAULT false,
  niches TEXT[] DEFAULT '{}',
  taal TEXT DEFAULT 'nl' CHECK (taal IN ('nl', 'fr', 'both')),
  provincie TEXT,
  min_vergoeding INTEGER DEFAULT 0,
  campagne_types TEXT[] DEFAULT '{}',
  tiktok_profiel_url TEXT,
  foto_url TEXT,
  is_beschikbaar BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MATCHES
-- ============================================================
CREATE TABLE IF NOT EXISTS matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE NOT NULL,
  creator_id UUID REFERENCES creators(id) ON DELETE CASCADE NOT NULL,
  ai_score INTEGER CHECK (ai_score BETWEEN 0 AND 100),
  score_niche INTEGER,
  score_engagement INTEGER,
  score_verkoop INTEGER,
  score_demo INTEGER,
  score_budget INTEGER,
  score_taal INTEGER,
  sterke_punten TEXT[] DEFAULT '{}',
  risicos TEXT[] DEFAULT '{}',
  aanbeveling TEXT,
  campagne_type TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed', 'expired')),
  brand_notitie TEXT,
  creator_notitie TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(brand_id, creator_id)
);

-- ============================================================
-- CAMPAGNES
-- ============================================================
CREATE TABLE IF NOT EXISTS campagnes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID REFERENCES matches(id) ON DELETE SET NULL,
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE NOT NULL,
  creator_id UUID REFERENCES creators(id) ON DELETE CASCADE NOT NULL,
  naam TEXT NOT NULL,
  beschrijving TEXT,
  campagne_type TEXT CHECK (campagne_type IN ('affiliate', 'gifting', 'paid')),
  budget NUMERIC(10,2),
  commissie_percentage NUMERIC(5,2) DEFAULT 15,
  affiliate_link TEXT,
  status TEXT DEFAULT 'concept' CHECK (status IN ('concept', 'actief', 'gepauzeerd', 'voltooid')),
  start_datum DATE,
  eind_datum DATE,
  clicks INTEGER DEFAULT 0,
  conversies INTEGER DEFAULT 0,
  omzet NUMERIC(10,2) DEFAULT 0,
  commissie_earned NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- WAITLIST
-- ============================================================
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  user_type TEXT CHECK (user_type IN ('brand', 'creator')),
  bedrijfsnaam TEXT,
  tiktok_handle TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER brands_updated BEFORE UPDATE ON brands FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE OR REPLACE TRIGGER creators_updated BEFORE UPDATE ON creators FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE OR REPLACE TRIGGER matches_updated BEFORE UPDATE ON matches FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE campagnes ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "profiles_own" ON profiles FOR ALL USING (auth.uid() = id);

-- Brands: eigen schrijven, alle lezen (voor matching)
CREATE POLICY "brands_read_all" ON brands FOR SELECT USING (true);
CREATE POLICY "brands_write_own" ON brands FOR ALL USING (auth.uid() = id);

-- Creators: alle lezen, eigen schrijven
CREATE POLICY "creators_read_all" ON creators FOR SELECT USING (true);
CREATE POLICY "creators_write_own" ON creators FOR ALL USING (auth.uid() = id);

-- Matches: brand of creator betrokken kan lezen; brand kan aanmaken/updaten
CREATE POLICY "matches_read" ON matches FOR SELECT USING (
  brand_id = auth.uid() OR creator_id = auth.uid()
);
CREATE POLICY "matches_insert_brand" ON matches FOR INSERT WITH CHECK (brand_id = auth.uid());
CREATE POLICY "matches_update" ON matches FOR UPDATE USING (
  brand_id = auth.uid() OR creator_id = auth.uid()
);

-- Campagnes: brand of creator betrokken
CREATE POLICY "campagnes_access" ON campagnes FOR ALL USING (
  brand_id = auth.uid() OR creator_id = auth.uid()
);

-- Waitlist: insert voor iedereen
CREATE POLICY "waitlist_insert" ON waitlist FOR INSERT WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS matches_brand_idx ON matches(brand_id);
CREATE INDEX IF NOT EXISTS matches_creator_idx ON matches(creator_id);
CREATE INDEX IF NOT EXISTS matches_score_idx ON matches(ai_score DESC);
CREATE INDEX IF NOT EXISTS campagnes_brand_idx ON campagnes(brand_id);
CREATE INDEX IF NOT EXISTS campagnes_creator_idx ON campagnes(creator_id);
