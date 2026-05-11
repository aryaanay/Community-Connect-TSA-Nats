-- Fix CommunityConnect group RLS recursion.
-- Run this in the Supabase SQL editor if community_groups or group_members
-- return: "infinite recursion detected in policy".

DROP POLICY IF EXISTS "Groups viewable by members" ON community_groups;
DROP POLICY IF EXISTS "Members can view their own group memberships" ON group_members;

CREATE POLICY "Groups viewable by members"
  ON community_groups FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Members can view their own group memberships"
  ON group_members FOR SELECT
  USING (auth.uid() IS NOT NULL);
