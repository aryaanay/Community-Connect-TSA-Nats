-- Community Connect clean Supabase rebuild
-- Paste this whole file into the Supabase SQL Editor and run it once.
-- It resets only this app's public tables. It does not delete Supabase Auth users.

begin;

create extension if not exists pgcrypto;

drop table if exists public.donations cascade;
drop table if exists public.submissions cascade;
drop table if exists public.resources cascade;
drop table if exists public.events cascade;
drop table if exists public.wishlist_causes cascade;

create table public.resources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  description text not null,
  address text,
  phone text,
  email text,
  hours text,
  website_url text,
  image_url text,
  is_verified boolean not null default false,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint resources_name_not_blank check (length(trim(name)) > 0),
  constraint resources_category_not_blank check (length(trim(category)) > 0),
  constraint resources_description_not_blank check (length(trim(description)) > 0)
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  event_date date not null,
  start_time time,
  end_time time,
  location_name text not null,
  event_type text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint events_title_not_blank check (length(trim(title)) > 0),
  constraint events_location_not_blank check (length(trim(location_name)) > 0),
  constraint events_time_order check (end_time is null or start_time is null or end_time >= start_time)
);

create table public.wishlist_causes (
  id uuid primary key default gen_random_uuid(),
  cause_name text not null unique,
  goal_amount numeric(12,2) not null,
  current_amount numeric(12,2) not null default 0,
  supporter_count integer not null default 0,
  category_icon text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint wishlist_goal_nonnegative check (goal_amount >= 0),
  constraint wishlist_current_nonnegative check (current_amount >= 0),
  constraint wishlist_supporters_nonnegative check (supporter_count >= 0),
  constraint wishlist_cause_name_not_blank check (length(trim(cause_name)) > 0)
);

create table public.donations (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  cause_id text not null,
  cause_name text,
  amount numeric(12,2) not null,
  stripe_payment_intent_id text,
  created_at timestamptz not null default now(),
  constraint donations_amount_positive check (amount > 0),
  constraint donations_user_not_blank check (length(trim(user_id)) > 0),
  constraint donations_cause_not_blank check (length(trim(cause_id)) > 0)
);

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'pending',
  resource_name text not null,
  category text not null,
  description text not null,
  contact_email text not null,
  phone text,
  address text,
  hours text,
  website text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint submissions_status_valid check (status in ('pending', 'approved', 'rejected')),
  constraint submissions_resource_name_not_blank check (length(trim(resource_name)) > 0),
  constraint submissions_category_not_blank check (length(trim(category)) > 0),
  constraint submissions_description_not_blank check (length(trim(description)) > 0),
  constraint submissions_contact_email_valid check (contact_email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$')
);

create index resources_verified_created_idx on public.resources (is_verified, created_at desc);
create index resources_category_idx on public.resources (category);
create index events_date_time_idx on public.events (event_date, start_time);
create index wishlist_causes_name_idx on public.wishlist_causes (cause_name);
create index donations_user_idx on public.donations (user_id);
create index donations_cause_idx on public.donations (cause_id);
create index submissions_status_created_idx on public.submissions (status, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_resources_updated_at
before update on public.resources
for each row execute function public.set_updated_at();

create trigger set_events_updated_at
before update on public.events
for each row execute function public.set_updated_at();

create trigger set_wishlist_causes_updated_at
before update on public.wishlist_causes
for each row execute function public.set_updated_at();

create trigger set_submissions_updated_at
before update on public.submissions
for each row execute function public.set_updated_at();

alter table public.resources enable row level security;
alter table public.events enable row level security;
alter table public.wishlist_causes enable row level security;
alter table public.donations enable row level security;
alter table public.submissions enable row level security;

-- Public app reads. The current Resources page intentionally shows unverified
-- submissions immediately for testing, so resources are readable by everyone.
create policy "Public can read resources"
on public.resources for select
to anon, authenticated
using (true);

create policy "Users can submit unverified resources"
on public.resources for insert
to anon, authenticated
with check (is_verified = false);

create policy "Public can read future events"
on public.events for select
to anon, authenticated
using (event_date >= current_date);

create policy "Public can read wishlist causes"
on public.wishlist_causes for select
to anon, authenticated
using (true);

-- The current client updates wishlist totals directly after Stripe succeeds.
create policy "Users can update wishlist totals"
on public.wishlist_causes for update
to anon, authenticated
using (true)
with check (current_amount >= 0 and supporter_count >= 0);

create policy "Authenticated users can read own donations"
on public.donations for select
to authenticated
using (user_id = auth.uid()::text);

create policy "Authenticated users can insert own donations"
on public.donations for insert
to authenticated
with check (user_id = auth.uid()::text);

create policy "Users can create submissions"
on public.submissions for insert
to anon, authenticated
with check (true);

create policy "Authenticated users can read matching email submissions"
on public.submissions for select
to authenticated
using (contact_email = auth.jwt() ->> 'email');

insert into public.wishlist_causes
  (cause_name, goal_amount, current_amount, supporter_count, category_icon)
values
  ('Bothell Food Bank', 5000, 3200, 87, 'food'),
  ('Youth Mentorship', 12000, 8900, 156, 'book'),
  ('Senior Companions', 4000, 2700, 62, 'heart'),
  ('Park Restoration', 15000, 9800, 203, 'tree'),
  ('Homeless Aid Fund', 10000, 6700, 98, 'home'),
  ('PAWS Pet Shelter', 8000, 5200, 124, 'paw')
on conflict (cause_name) do update set
  goal_amount = excluded.goal_amount,
  current_amount = excluded.current_amount,
  supporter_count = excluded.supporter_count,
  category_icon = excluded.category_icon;

insert into public.events
  (title, description, event_date, start_time, end_time, location_name, event_type)
values
  ('STEM Mentorship Workshop', 'Guest speakers from local universities and hands-on breakout sessions for aspiring STEM students.', '2026-05-02', '16:00', '18:30', 'Bothell Regional Library, 18215 98th Ave NE, Bothell WA', 'Education'),
  ('Northshore Food Drive', 'Help stock the Hopelink Bothell food bank. Drop off non-perishable items and baby supplies.', '2026-05-16', '09:00', '16:00', 'Hopelink Bothell, 23640 Bothell Everett Hwy, Bothell WA', 'Donation'),
  ('Clothing & Essentials Drive', 'Donate gently used clothing, shoes, and household essentials for Northshore families.', '2026-05-30', '10:00', '15:00', 'Bothell City Hall, 18415 101st Ave NE, Bothell WA', 'Donation'),
  ('Community Garden Workshop', 'Learn sustainable gardening, composting, and organic growing techniques.', '2026-06-06', '09:00', '12:00', 'Bothell Community Garden, 5th & Maple, Bothell WA', 'Community'),
  ('Senior Health & Wellness Fair', 'Free health screenings, fitness demos, nutrition workshops, and social activities.', '2026-06-20', '10:00', '14:00', 'Northshore Senior Center, 10201 E Riverside Dr, Bothell WA', 'Health'),
  ('Bothell Independence Day Celebration', 'Live music, food vendors, kids activities, and the annual fireworks display.', '2026-07-04', '12:00', '21:00', 'Bothell Landing Park, 9919 NE 180th St, Bothell WA', 'Community'),
  ('Back-to-School Supply Drive', 'Donate backpacks, notebooks, pencils, and school supplies for Northshore students in need.', '2026-08-08', '10:00', '15:00', 'Northshore Volunteer Services, 6809 228th St SW, Mountlake Terrace WA', 'Donation');

insert into public.resources
  (name, category, description, address, phone, email, hours, website_url, is_verified, is_featured)
values
  ('Bothell Regional Library (KCLS)', 'Education', 'Free access to books, digital resources, study rooms, homework help, and community programs for all ages.', 'Bothell Regional Library, 18215 98th Ave NE, Bothell WA 98011', '(425) 486-7811', 'askus@kcls.org', 'Mon-Thu 10AM-8PM, Fri-Sat 10AM-6PM, Sun 1-5PM', 'https://kcls.org', true, true),
  ('Northshore School District', 'Education', 'Family engagement programs, multilingual support, special education services, and community partnerships.', '3330 Monte Villa Pkwy, Bothell WA 98021', '(425) 408-7600', 'info@nsd.org', 'Mon-Fri 7:30AM-4:30PM', 'https://www.nsd.org', true, true),
  ('Northshore Volunteer Services', 'Volunteering', 'Connecting Bothell-area volunteers with meaningful community opportunities.', '6809 228th St SW, Mountlake Terrace WA 98043', '(425) 485-1112', 'office@nvskc.org', 'Mon-Fri 9AM-5PM', null, true, false),
  ('Hopelink Bothell', 'Community Projects', 'Food, financial assistance, housing, and transportation services for families and individuals in need.', '23640 Bothell Everett Hwy, Bothell WA 98021', '(425) 943-6700', 'info@hope-link.org', 'Mon-Fri 9AM-4PM', 'https://www.hopelink.org', true, true),
  ('EvergreenHealth Medical Center', 'Health', 'Full-service hospital and medical center providing emergency care, primary care, and specialty services.', '12040 NE 128th St, Kirkland WA 98034', '(425) 899-5200', 'info@evergreenhealth.com', 'Emergency: 24/7 | Clinics: Mon-Fri 8AM-5PM', 'https://www.evergreenhealth.com', true, false),
  ('Northshore Senior Center', 'Health', 'Social, educational, and wellness programs for adults 50+.', '10201 E Riverside Dr, Bothell WA 98011', '(425) 488-1785', 'info@northshoresenior.org', 'Mon-Fri 8:30AM-4:30PM', 'https://www.northshoreseniorcenter.org', true, false);

commit;
