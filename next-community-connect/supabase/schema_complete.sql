-- ============================================================
-- Community Connect — Full Supabase Schema (all tables)
-- Paste this entire file into Supabase SQL Editor and Run.
-- Safe to re-run: uses IF NOT EXISTS, DROP POLICY IF EXISTS,
-- and ON CONFLICT DO NOTHING for seed data.
-- ============================================================

-- ──────────────────────────────────────────────
-- PROFILES
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  display_name  TEXT NOT NULL,
  email         TEXT NOT NULL,
  bio           TEXT,
  is_public     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users manage own profile" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT USING (is_public = true);
CREATE POLICY "Users manage own profile"
  ON profiles FOR ALL USING ((auth.uid())::uuid = user_id);

-- ──────────────────────────────────────────────
-- USER-CREATED EVENTS
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_events (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  creator_email  TEXT,
  title          TEXT NOT NULL,
  description    TEXT,
  date           TEXT NOT NULL,
  time           TEXT,
  location       TEXT,
  lat            DECIMAL,
  lng            DECIMAL,
  category       TEXT DEFAULT 'Community',
  emoji          TEXT DEFAULT '📅',
  is_public      BOOLEAN DEFAULT true,
  invite_emails  TEXT[],
  created_at     TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE user_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public events visible to all" ON user_events;
DROP POLICY IF EXISTS "Authenticated users can insert events" ON user_events;
DROP POLICY IF EXISTS "Users can update/delete own events" ON user_events;
CREATE POLICY "Public events visible to all"
  ON user_events FOR SELECT USING (is_public = true OR (auth.uid())::uuid = user_id);
CREATE POLICY "Authenticated users can insert events"
  ON user_events FOR INSERT WITH CHECK ((auth.uid())::uuid = user_id);
CREATE POLICY "Users can update/delete own events"
  ON user_events FOR ALL USING ((auth.uid())::uuid = user_id);

-- ──────────────────────────────────────────────
-- COMMUNITY GROUPS
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS community_groups (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id   UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  description  TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE community_groups ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Groups viewable by members" ON community_groups;
DROP POLICY IF EXISTS "Authenticated users can create groups" ON community_groups;
DROP POLICY IF EXISTS "Creators can update/delete own groups" ON community_groups;
CREATE POLICY "Groups viewable by members"
  ON community_groups FOR SELECT USING (
    (auth.uid())::uuid = creator_id OR
    EXISTS (
      SELECT 1 FROM group_members gm
      WHERE gm.group_id = community_groups.id
        AND gm.user_id = (auth.uid())::uuid
    )
  );
CREATE POLICY "Authenticated users can create groups"
  ON community_groups FOR INSERT WITH CHECK ((auth.uid())::uuid = creator_id);
CREATE POLICY "Creators can update/delete own groups"
  ON community_groups FOR ALL USING ((auth.uid())::uuid = creator_id);

CREATE TABLE IF NOT EXISTS group_members (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id   UUID REFERENCES community_groups(id) ON DELETE CASCADE,
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email      TEXT NOT NULL,
  role       TEXT DEFAULT 'member',
  added_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(group_id, email)
);
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Members can view their own group memberships" ON group_members;
DROP POLICY IF EXISTS "Admins can manage members" ON group_members;
CREATE POLICY "Members can view their own group memberships"
  ON group_members FOR SELECT USING (
    (auth.uid())::uuid = user_id OR
    EXISTS (SELECT 1 FROM community_groups cg WHERE cg.id = group_id AND cg.creator_id = (auth.uid())::uuid)
  );
CREATE POLICY "Admins can manage members"
  ON group_members FOR ALL USING (
    EXISTS (SELECT 1 FROM community_groups cg WHERE cg.id = group_id AND cg.creator_id = (auth.uid())::uuid)
    OR (auth.uid())::uuid = user_id
  );

-- ──────────────────────────────────────────────
-- LOST & FOUND
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS lost_found (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  type            TEXT NOT NULL CHECK (type IN ('lost', 'found')),
  title           TEXT NOT NULL,
  description     TEXT,
  location        TEXT,
  contact_email   TEXT,
  contact_phone   TEXT,
  date_occurred   TEXT,
  status          TEXT DEFAULT 'open' CHECK (status IN ('open', 'resolved')),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE lost_found ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lost & Found items viewable by everyone" ON lost_found;
DROP POLICY IF EXISTS "Authenticated users can post items" ON lost_found;
DROP POLICY IF EXISTS "Users can update/resolve own items" ON lost_found;
CREATE POLICY "Lost & Found items viewable by everyone"
  ON lost_found FOR SELECT USING (true);
CREATE POLICY "Authenticated users can post items"
  ON lost_found FOR INSERT WITH CHECK ((auth.uid())::uuid = user_id);
CREATE POLICY "Users can update/resolve own items"
  ON lost_found FOR UPDATE USING ((auth.uid())::uuid = user_id);

-- ──────────────────────────────────────────────
-- OFFICIAL EVENTS (curated)
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
  ON event_rsvps FOR SELECT USING ((auth.uid())::uuid = user_id);
CREATE POLICY "Authenticated users can RSVP"
  ON event_rsvps FOR INSERT WITH CHECK ((auth.uid())::uuid = user_id);
CREATE POLICY "Users can remove own RSVP"
  ON event_rsvps FOR DELETE USING ((auth.uid())::uuid = user_id);

-- ──────────────────────────────────────────────
-- RESOURCES
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
-- SUBMISSIONS
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
-- DONATIONS
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
  ON donations FOR SELECT USING ((auth.uid())::uuid = user_id);
CREATE POLICY "Authenticated users can donate"
  ON donations FOR INSERT WITH CHECK ((auth.uid())::uuid = user_id);

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
  ON user_achievements FOR SELECT USING ((auth.uid())::uuid = user_id);
CREATE POLICY "Users can insert own achievements"
  ON user_achievements FOR INSERT WITH CHECK ((auth.uid())::uuid = user_id);
CREATE POLICY "Users can delete own achievements"
  ON user_achievements FOR DELETE USING ((auth.uid())::uuid = user_id);

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
  ON favors FOR INSERT WITH CHECK ((auth.uid())::uuid = user_id);
CREATE POLICY "Owners can update favors"
  ON favors FOR UPDATE USING ((auth.uid())::uuid = user_id);

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
DROP POLICY IF EXISTS "Authenticated users can offer help" ON favor_helps;
DROP POLICY IF EXISTS "Helpers can withdraw help" ON favor_helps;
CREATE POLICY "Helper can view own help records"
  ON favor_helps FOR SELECT USING ((auth.uid())::uuid = helper_id);
CREATE POLICY "Authenticated users can offer help"
  ON favor_helps FOR INSERT WITH CHECK ((auth.uid())::uuid = helper_id);
CREATE POLICY "Helpers can withdraw help"
  ON favor_helps FOR DELETE USING ((auth.uid())::uuid = helper_id);
