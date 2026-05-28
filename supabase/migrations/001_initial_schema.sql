-- ============================================================
-- TikToMatch — Initieel database schema
-- ============================================================

-- User types enum
CREATE TYPE user_type AS ENUM ('brand', 'creator');
CREATE TYPE campagne_type AS ENUM ('affiliate', 'gifting', 'paid');
CREATE TYPE match_status AS ENUM ('pending', 'accepted', 'rejected', 'completed');
CREATE TYPE taal_type AS ENUM ('nl', 'fr', 'both');

-- ============================================================
-- PROFILES tabel (uitbreiding van auth.users)
-- ============================================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  user_type user_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Automatisch profiel aanmaken bij nieuwe user
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, user_type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      (NEW.raw_user_meta_data->>'user_type')::user_type,
      'creator'
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- CREATORS tabel
-- ============================================================
CREATE TABLE creators (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  tiktok_handle TEXT NOT NULL,
  follower_count INTEGER NOT NULL DEFAULT 0,
  avg_engagement_rate NUMERIC(5,2) NOT NULL DEFAULT 0,
  niches TEXT[] NOT NULL DEFAULT '{}',
  taal taal_type NOT NULL DEFAULT 'nl',
  provincie TEXT NOT NULL DEFAULT '',
  verified_seller BOOLEAN NOT NULL DEFAULT false,
  gmv_30d NUMERIC(10,2) NOT NULL DEFAULT 0,
  avg_views INTEGER NOT NULL DEFAULT 0,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER creators_updated_at
  BEFORE UPDATE ON creators
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- BRANDS tabel
-- ============================================================
CREATE TABLE brands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  bedrijfsnaam TEXT NOT NULL,
  website TEXT,
  product_categorieen TEXT[] NOT NULL DEFAULT '{}',
  budget_min NUMERIC(10,2) NOT NULL DEFAULT 0,
  budget_max NUMERIC(10,2) NOT NULL DEFAULT 0,
  doelgroep_leeftijd TEXT,
  doelgroep_geslacht TEXT,
  campagne_type campagne_type NOT NULL DEFAULT 'paid',
  btw_nummer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER brands_updated_at
  BEFORE UPDATE ON brands
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- MATCHES tabel
-- ============================================================
CREATE TABLE matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE NOT NULL,
  creator_id UUID REFERENCES creators(id) ON DELETE CASCADE NOT NULL,
  ai_score SMALLINT NOT NULL CHECK (ai_score >= 0 AND ai_score <= 100),
  ai_uitleg TEXT,
  status match_status NOT NULL DEFAULT 'pending',
  aangemaakt_op TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(brand_id, creator_id)
);

CREATE INDEX matches_brand_id_idx ON matches(brand_id);
CREATE INDEX matches_creator_id_idx ON matches(creator_id);
CREATE INDEX matches_status_idx ON matches(status);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Profiles: eigen profiel lezen en updaten
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Creators: eigen profiel beheren; brands kunnen alle creators zien
CREATE POLICY "creators_select_all" ON creators
  FOR SELECT USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND user_type = 'brand'
    )
  );

CREATE POLICY "creators_insert_own" ON creators
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "creators_update_own" ON creators
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "creators_delete_own" ON creators
  FOR DELETE USING (auth.uid() = user_id);

-- Brands: alleen eigen data zien/bewerken
CREATE POLICY "brands_select_own" ON brands
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "brands_insert_own" ON brands
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "brands_update_own" ON brands
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "brands_delete_own" ON brands
  FOR DELETE USING (auth.uid() = user_id);

-- Matches: brand ziet eigen matches; creator ziet eigen matches
CREATE POLICY "matches_select_brand" ON matches
  FOR SELECT USING (
    brand_id IN (SELECT id FROM brands WHERE user_id = auth.uid())
    OR creator_id IN (SELECT id FROM creators WHERE user_id = auth.uid())
  );

CREATE POLICY "matches_insert_brand" ON matches
  FOR INSERT WITH CHECK (
    brand_id IN (SELECT id FROM brands WHERE user_id = auth.uid())
  );

CREATE POLICY "matches_update_status" ON matches
  FOR UPDATE USING (
    brand_id IN (SELECT id FROM brands WHERE user_id = auth.uid())
    OR creator_id IN (SELECT id FROM creators WHERE user_id = auth.uid())
  );
