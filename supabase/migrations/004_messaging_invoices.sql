-- ============================================================
-- TikToMatch v2 — Messaging, Invoices, Notifications, Contracts
-- ============================================================

-- Messages (platform-only communicatie tussen brand en creator)
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  gelezen BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS messages_match_idx ON messages(match_id);
CREATE INDEX IF NOT EXISTS messages_sender_idx ON messages(sender_id);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "messages_access" ON messages FOR ALL USING (
  EXISTS (
    SELECT 1 FROM matches m
    WHERE m.id = match_id
    AND (m.brand_id = auth.uid() OR m.creator_id = auth.uid())
  )
);

-- Invoices
CREATE TABLE IF NOT EXISTS invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE NOT NULL,
  campagne_id UUID REFERENCES campagnes(id) ON DELETE SET NULL,
  invoice_number TEXT UNIQUE NOT NULL,
  omschrijving TEXT NOT NULL,
  subtotaal NUMERIC(10,2) NOT NULL,
  btw_percentage NUMERIC(5,2) DEFAULT 21,
  btw_bedrag NUMERIC(10,2),
  totaal NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'betaald', 'vervallen')),
  vervaldatum DATE,
  betaald_op TIMESTAMPTZ,
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS invoices_brand_idx ON invoices(brand_id);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "invoices_brand_own" ON invoices FOR ALL USING (brand_id = auth.uid());
-- Service role kan alles (voor auto-generatie)
CREATE POLICY "invoices_service" ON invoices FOR ALL USING (auth.role() = 'service_role');

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('match', 'bericht', 'factuur', 'campagne', 'uitbetaling', 'systeem')),
  titel TEXT NOT NULL,
  body TEXT,
  link TEXT,
  gelezen BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS notifications_user_idx ON notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_unread_idx ON notifications(user_id, gelezen);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications_own" ON notifications FOR ALL USING (user_id = auth.uid());

-- Contract acceptance op matches
ALTER TABLE matches ADD COLUMN IF NOT EXISTS creator_contract_accepted_at TIMESTAMPTZ;
ALTER TABLE matches ADD COLUMN IF NOT EXISTS brand_contract_accepted_at TIMESTAMPTZ;
ALTER TABLE matches ADD COLUMN IF NOT EXISTS platform_fee_percentage NUMERIC(5,2) DEFAULT 20;

-- Campagne: add invoice_id reference
ALTER TABLE campagnes ADD COLUMN IF NOT EXISTS invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL;

-- Sequence voor factuurnummers
CREATE SEQUENCE IF NOT EXISTS invoice_number_seq START 1000;

-- Functie: auto-notificatie bij nieuwe match
CREATE OR REPLACE FUNCTION notify_new_match()
RETURNS TRIGGER AS $$
BEGIN
  -- Notificeer creator
  INSERT INTO notifications (user_id, type, titel, body, link)
  VALUES (
    NEW.creator_id,
    'match',
    'Nieuw brand uitnodiging',
    'Een brand heeft je geselecteerd voor een campagne. Bekijk de details.',
    '/dashboard/creator/aanbiedingen'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_new_match ON matches;
CREATE TRIGGER on_new_match
  AFTER INSERT ON matches
  FOR EACH ROW EXECUTE FUNCTION notify_new_match();

-- Functie: auto-notificatie bij nieuw bericht
CREATE OR REPLACE FUNCTION notify_new_message()
RETURNS TRIGGER AS $$
DECLARE
  v_brand_id UUID;
  v_creator_id UUID;
  v_receiver_id UUID;
BEGIN
  SELECT brand_id, creator_id INTO v_brand_id, v_creator_id
  FROM matches WHERE id = NEW.match_id;

  -- Stuur notificatie naar de andere partij
  IF NEW.sender_id = v_brand_id THEN
    v_receiver_id := v_creator_id;
  ELSE
    v_receiver_id := v_brand_id;
  END IF;

  INSERT INTO notifications (user_id, type, titel, body, link)
  VALUES (
    v_receiver_id,
    'bericht',
    'Nieuw bericht ontvangen',
    'Je hebt een nieuw bericht via het platform ontvangen.',
    CASE WHEN v_receiver_id = v_brand_id
      THEN '/dashboard/brand/berichten'
      ELSE '/dashboard/creator/berichten'
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_new_message ON messages;
CREATE TRIGGER on_new_message
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION notify_new_message();

-- Grants
GRANT ALL ON messages TO anon, authenticated, service_role;
GRANT ALL ON invoices TO anon, authenticated, service_role;
GRANT ALL ON notifications TO anon, authenticated, service_role;
GRANT USAGE, SELECT ON SEQUENCE invoice_number_seq TO service_role;
