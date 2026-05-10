-- ============================================================
-- Community Connect — Complete Supabase Schema
-- Paste this entire file into your Supabase SQL Editor and Run.
-- Safe to run multiple times (uses IF NOT EXISTS + ON CONFLICT).
-- ============================================================

-- ──────────────────────────────────────────────
-- EVENTS (official curated events)
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  description   TEXT,
  event_date    DATE NOT NULL,
  start_time    TIME NOT NULL,
  end_time      TIME,
  location_name TEXT,
  event_type    TEXT DEFAULT 'Community',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Events viewable by everyone" ON events;
DROP POLICY IF EXISTS "Authenticated users can insert events" ON events;
CREATE POLICY "Events viewable by everyone"
  ON events FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert events"
  ON events FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ──────────────────────────────────────────────
-- EVENT RSVPs
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS event_rsvps (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id   TEXT NOT NULL,
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);
ALTER TABLE event_rsvps ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "RSVPs viewable by owner" ON event_rsvps;
DROP POLICY IF EXISTS "Authenticated users can RSVP" ON event_rsvps;
DROP POLICY IF EXISTS "Users can remove own RSVP" ON event_rsvps;
CREATE POLICY "RSVPs viewable by owner"
  ON event_rsvps FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Authenticated users can RSVP"
  ON event_rsvps FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove own RSVP"
  ON event_rsvps FOR DELETE USING (auth.uid() = user_id);

-- ──────────────────────────────────────────────
-- RESOURCES (community resource directory)
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS resources (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  category    TEXT NOT NULL,
  description TEXT,
  address     TEXT,
  phone       TEXT,
  email       TEXT,
  hours       TEXT,
  website_url TEXT,
  image_url   TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Resources viewable by everyone" ON resources;
DROP POLICY IF EXISTS "Authenticated users can submit resources" ON resources;
DROP POLICY IF EXISTS "Admins can update resources" ON resources;
DROP POLICY IF EXISTS "Admins can delete resources" ON resources;
CREATE POLICY "Resources viewable by everyone"
  ON resources FOR SELECT USING (true);
CREATE POLICY "Authenticated users can submit resources"
  ON resources FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can update resources"
  ON resources FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can delete resources"
  ON resources FOR DELETE USING (auth.uid() IS NOT NULL);

-- ──────────────────────────────────────────────
-- SUBMISSIONS (pending resource review)
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS submissions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_name TEXT NOT NULL,
  category      TEXT NOT NULL,
  description   TEXT,
  contact_email TEXT,
  phone         TEXT,
  address       TEXT,
  hours         TEXT,
  website       TEXT,
  status        TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can submit a resource" ON submissions;
DROP POLICY IF EXISTS "Authenticated users can view submissions" ON submissions;
CREATE POLICY "Anyone can submit a resource"
  ON submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can view submissions"
  ON submissions FOR SELECT USING (auth.uid() IS NOT NULL);

-- ──────────────────────────────────────────────
-- WISHLIST CAUSES
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wishlist_causes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cause_name      TEXT NOT NULL UNIQUE,
  current_amount  INTEGER DEFAULT 0,
  supporter_count INTEGER DEFAULT 0,
  goal_amount     INTEGER DEFAULT 5000
);
ALTER TABLE wishlist_causes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Causes viewable by everyone" ON wishlist_causes;
DROP POLICY IF EXISTS "Authenticated users can update causes" ON wishlist_causes;
CREATE POLICY "Causes viewable by everyone"
  ON wishlist_causes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can update causes"
  ON wishlist_causes FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Seed the causes (safe to re-run)
INSERT INTO wishlist_causes (cause_name, current_amount, supporter_count, goal_amount) VALUES
  ('Community Food Bank',        1240, 31, 5000),
  ('Youth Arts Program',          870, 22, 3000),
  ('Housing Assistance',         2100, 47, 8000),
  ('Neighborhood Health Clinic',  560, 14, 4000),
  ('Park Restoration',            340,  9, 2500),
  ('Homeless Aid Fund',           980, 26, 6000),
  ('PAWS Pet Shelter',            450, 12, 3500)
ON CONFLICT (cause_name) DO NOTHING;

-- ──────────────────────────────────────────────
-- DONATIONS (simulated, for demo)
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS donations (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  cause_id   TEXT NOT NULL,
  amount     INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own donations" ON donations;
DROP POLICY IF EXISTS "Authenticated users can donate" ON donations;
CREATE POLICY "Users can view own donations"
  ON donations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Authenticated users can donate"
  ON donations FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ──────────────────────────────────────────────
-- USER ACHIEVEMENTS
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_achievements (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  unlocked_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own achievements" ON user_achievements;
DROP POLICY IF EXISTS "Users can insert own achievements" ON user_achievements;
DROP POLICY IF EXISTS "Users can delete own achievements" ON user_achievements;
CREATE POLICY "Users can view own achievements"
  ON user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own achievements"
  ON user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own achievements"
  ON user_achievements FOR DELETE USING (auth.uid() = user_id);

-- ──────────────────────────────────────────────
-- COMMUNITY FAVORS
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS favors (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title         TEXT NOT NULL,
  description   TEXT,
  location      TEXT,
  pay_amount    TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  status        TEXT DEFAULT 'open' CHECK (status IN ('open', 'done')),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE favors ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Favors viewable by everyone" ON favors;
DROP POLICY IF EXISTS "Authenticated users can post favors" ON favors;
DROP POLICY IF EXISTS "Owners can update favors" ON favors;
CREATE POLICY "Favors viewable by everyone"
  ON favors FOR SELECT USING (true);
CREATE POLICY "Authenticated users can post favors"
  ON favors FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners can update favors"
  ON favors FOR UPDATE USING (auth.uid() = user_id);

-- ──────────────────────────────────────────────
-- FAVOR HELPS
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS favor_helps (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  favor_id     UUID REFERENCES favors(id) ON DELETE CASCADE,
  helper_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  helper_email TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(favor_id, helper_id)
);
ALTER TABLE favor_helps ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Helper can view own help records" ON favor_helps;
DROP POLICY IF EXISTS "Favor owners can view help records" ON favor_helps;
DROP POLICY IF EXISTS "Authenticated users can offer help" ON favor_helps;
DROP POLICY IF EXISTS "Helpers can withdraw help" ON favor_helps;
CREATE POLICY "Helper can view own help records"
  ON favor_helps FOR SELECT USING (auth.uid() = helper_id);
CREATE POLICY "Authenticated users can offer help"
  ON favor_helps FOR INSERT WITH CHECK (auth.uid() = helper_id);
CREATE POLICY "Helpers can withdraw help"
  ON favor_helps FOR DELETE USING (auth.uid() = helper_id);

-- ──────────────────────────────────────────────
-- Also enable realtime for live resource updates
-- ──────────────────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE resources;
