-- Run this in your Supabase SQL editor to enable all community features.

-- ──────────────────────────────────────────────
-- Public user profiles (opt-in community directory)
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
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT USING (is_public = true);
CREATE POLICY "Users manage own profile"
  ON profiles FOR ALL USING (auth.uid() = user_id);

-- ──────────────────────────────────────────────
-- User-created events (public or private)
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_events (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  creator_email  TEXT,
  title          TEXT NOT NULL,
  description    TEXT,
  date           TEXT NOT NULL,          -- "May 15, 2026"
  time           TEXT,                   -- "3:00 PM - 5:00 PM"
  location       TEXT,
  lat            DECIMAL,
  lng            DECIMAL,
  category       TEXT DEFAULT 'Community',
  emoji          TEXT DEFAULT '📅',
  is_public      BOOLEAN DEFAULT true,
  invite_emails  TEXT[],                 -- for private events
  created_at     TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE user_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public events visible to all"
  ON user_events FOR SELECT USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "Authenticated users can insert events"
  ON user_events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update/delete own events"
  ON user_events FOR ALL USING (auth.uid() = user_id);

-- ──────────────────────────────────────────────
-- Community groups
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS community_groups (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id   UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  description  TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE community_groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Groups viewable by members"
  ON community_groups FOR SELECT USING (
    auth.uid() = creator_id OR
    EXISTS (
      SELECT 1 FROM group_members gm
      WHERE gm.group_id = community_groups.id
        AND gm.user_id = auth.uid()
    )
  );
CREATE POLICY "Authenticated users can create groups"
  ON community_groups FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Creators can update/delete own groups"
  ON community_groups FOR ALL USING (auth.uid() = creator_id);

CREATE TABLE IF NOT EXISTS group_members (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id   UUID REFERENCES community_groups(id) ON DELETE CASCADE,
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email      TEXT NOT NULL,
  role       TEXT DEFAULT 'member',      -- 'admin' or 'member'
  added_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(group_id, email)
);
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can view their own group memberships"
  ON group_members FOR SELECT USING (user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM community_groups cg WHERE cg.id = group_id AND cg.creator_id = auth.uid())
  );
CREATE POLICY "Admins can manage members"
  ON group_members FOR ALL USING (
    EXISTS (SELECT 1 FROM community_groups cg WHERE cg.id = group_id AND cg.creator_id = auth.uid())
    OR user_id = auth.uid()
  );

-- ──────────────────────────────────────────────
-- Lost & Found
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
CREATE POLICY "Lost & Found items viewable by everyone"
  ON lost_found FOR SELECT USING (true);
CREATE POLICY "Authenticated users can post items"
  ON lost_found FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update/resolve own items"
  ON lost_found FOR UPDATE USING (auth.uid() = user_id);
