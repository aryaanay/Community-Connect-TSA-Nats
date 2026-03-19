-- Supabase Schema for Community Connect
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Resources table (extended schema to match hardcoded)
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,                    -- Added for hardcoded match
  hours TEXT,                    -- Added for hardcoded match
  website_url TEXT,
  image_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  location_name TEXT NOT NULL,
  event_type TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Wishlist causes
CREATE TABLE wishlist_causes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cause_name TEXT NOT NULL,
  goal_amount NUMERIC NOT NULL,
  current_amount NUMERIC DEFAULT 0,
  supporter_count INTEGER DEFAULT 0,
  category_icon TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Submissions
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  status TEXT DEFAULT 'pending',
  resource_name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  hours TEXT,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;  
ALTER TABLE wishlist_causes ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Public can read VERIFIED resources/events
CREATE POLICY "Public read verified resources" ON resources
  FOR SELECT USING (is_verified = true);

CREATE POLICY "Public read future events" ON events  
  FOR SELECT USING (event_date >= CURRENT_DATE);

CREATE POLICY "Public read wishlist causes" ON wishlist_causes
  FOR SELECT USING (true);

-- Anyone can INSERT submissions  
CREATE POLICY "Anyone insert submissions" ON submissions
  FOR INSERT WITH CHECK (true);

-- Authenticated users can read all their submissions
CREATE POLICY "Users read own submissions" ON submissions
  FOR SELECT USING (auth.uid()::text = contact_email);

