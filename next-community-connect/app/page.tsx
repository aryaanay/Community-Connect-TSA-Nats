'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { HeroDemo } from '@/components/ui/animated-hero-demo'
import { MissionTicker } from '@/components/MissionTicker'
import { MapPin, CalendarDays, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

// ─── Location data ────────────────────────────────────────────────────────────

const LOCATIONS = [
  { id: 'bothell', name: 'Bothell' },
  { id: 'kenmore', name: 'Kenmore' },
  { id: 'woodinville', name: 'Woodinville' },
  { id: 'kirkland', name: 'Kirkland' },
  { id: 'redmond', name: 'Redmond' },
]

type Evt = { emoji: string; name: string; date: string; time: string; location: string; category: string }

const EVENTS: Record<string, Evt[]> = {
  bothell: [
    { emoji: '🌿', name: 'Community Cleanup Drive', date: 'Apr 25', time: '10am–1pm', location: 'Bothell Landing Park', category: 'Environment' },
    { emoji: '📚', name: 'STEM Mentorship Workshop', date: 'May 2', time: '4pm', location: 'Northshore Library', category: 'Education' },
    { emoji: '🥫', name: 'Northshore Food Drive', date: 'May 16', time: '9am–4pm', location: 'Multiple drop-offs', category: 'Community' },
  ],
  kenmore: [
    { emoji: '🌳', name: 'St. Edward Park Restoration', date: 'May 3', time: '9am–12pm', location: 'St. Edward State Park', category: 'Environment' },
    { emoji: '💙', name: 'Senior Outreach Day', date: 'May 20', time: '11am–3pm', location: 'Kenmore Senior Center', category: 'Senior Care' },
    { emoji: '🎒', name: 'Youth Backpack Drive', date: 'Jun 5', time: '10am–2pm', location: 'Kenmore City Hall', category: 'Youth' },
  ],
  woodinville: [
    { emoji: '🌱', name: 'Community Garden Planting', date: 'May 10', time: '9am–1pm', location: 'Wilmot Gateway Park', category: 'Environment' },
    { emoji: '🏥', name: 'Health Resource Fair', date: 'May 24', time: '10am–4pm', location: 'Woodinville Comm. Center', category: 'Health' },
    { emoji: '🤝', name: 'Volunteer Orientation', date: 'May 30', time: '6pm–8pm', location: 'Woodinville Library', category: 'Volunteer' },
  ],
  kirkland: [
    { emoji: '🎆', name: 'Kirkland Summer Kick-off', date: 'May 28', time: '12pm–8pm', location: 'Marina Park', category: 'Community' },
    { emoji: '📖', name: 'Adult Literacy Workshop', date: 'May 7', time: '6pm–8pm', location: 'Kirkland Library', category: 'Education' },
    { emoji: '🐾', name: 'Pet Adoption Event', date: 'May 18', time: '11am–4pm', location: 'Juanita Beach Park', category: 'Animals' },
  ],
  redmond: [
    { emoji: '🚴', name: 'Bear Creek Trail Cleanup', date: 'May 4', time: '8am–11am', location: 'Bear Creek Trail', category: 'Environment' },
    { emoji: '💡', name: 'Tech Skills for Seniors', date: 'May 15', time: '2pm–5pm', location: 'Redmond Library', category: 'Education' },
    { emoji: '🌾', name: 'Community Garden Day', date: 'Jun 1', time: '10am–2pm', location: 'Redmond Central Park', category: 'Environment' },
  ],
}

const CAT_COLORS: Record<string, string> = {
  Environment: '#10B981', Education: '#2499D6', Community: '#FF8C42',
  'Senior Care': '#6B3FA0', Youth: '#E85D26', Health: '#EF4444',
  Volunteer: '#56BBF0', Animals: '#F59E0B',
}

// ─── Events section ───────────────────────────────────────────────────────────

function LocationEvents() {
  const [loc, setLoc] = useState('bothell')
  const events = EVENTS[loc] ?? []

  return (
    <section id="events" style={{ background: 'linear-gradient(180deg, #010f1f 0%, #022040 100%)' }} className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center mb-10"
        >
          <span className="section-eyebrow">Near You</span>
          <h2 className="font-syne text-3xl sm:text-4xl font-bold text-white mt-2 mb-3">
            Upcoming Community Events
          </h2>
          <p className="font-outfit text-sm max-w-md mx-auto" style={{ color: 'rgba(198,235,255,0.5)' }}>
            Select your area to see what's happening locally. Sign in to RSVP and get reminders.
          </p>
        </motion.div>

        {/* Location selector */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {LOCATIONS.map((l) => (
            <button
              key={l.id}
              onClick={() => setLoc(l.id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full font-outfit text-sm transition-all duration-200"
              style={{
                background: loc === l.id ? 'rgba(36,153,214,0.22)' : 'rgba(86,187,240,0.05)',
                border: `1px solid ${loc === l.id ? 'rgba(86,187,240,0.38)' : 'rgba(86,187,240,0.1)'}`,
                color: loc === l.id ? '#90D4F7' : 'rgba(198,235,255,0.45)',
              }}
            >
              <MapPin size={11} />
              {l.name}, WA
            </button>
          ))}
        </div>

        {/* Event cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={loc}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {events.map((ev) => (
              <div
                key={ev.name}
                className="rounded-2xl p-5"
                style={{ background: 'rgba(2,39,71,0.6)', border: '1px solid rgba(86,187,240,0.1)', backdropFilter: 'blur(12px)' }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: 'rgba(86,187,240,0.08)', border: '1px solid rgba(86,187,240,0.14)' }}
                  >
                    {ev.emoji}
                  </div>
                  <div className="min-w-0">
                    <span
                      className="inline-block font-outfit text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1"
                      style={{
                        background: `${CAT_COLORS[ev.category] ?? '#56BBF0'}18`,
                        color: CAT_COLORS[ev.category] ?? '#56BBF0',
                        border: `1px solid ${CAT_COLORS[ev.category] ?? '#56BBF0'}28`,
                      }}
                    >
                      {ev.category}
                    </span>
                    <p className="font-syne text-sm font-bold text-white leading-snug">{ev.name}</p>
                  </div>
                </div>
                <div className="space-y-1 pl-0.5">
                  <p className="flex items-center gap-1.5 font-outfit text-xs" style={{ color: '#56BBF0' }}>
                    <CalendarDays size={10} /> {ev.date}
                  </p>
                  <p className="flex items-center gap-1.5 font-outfit text-xs" style={{ color: 'rgba(198,235,255,0.38)' }}>
                    <Clock size={10} /> {ev.time}
                  </p>
                  <p className="flex items-center gap-1.5 font-outfit text-xs" style={{ color: 'rgba(198,235,255,0.32)' }}>
                    <MapPin size={10} /> {ev.location}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Sign-in CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-center mt-12"
        >
          <p className="font-outfit text-sm mb-5" style={{ color: 'rgba(198,235,255,0.4)' }}>
            Join Community Connect to RSVP, submit resources, and donate to local causes.
          </p>
          <Link
            href="/signin"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-outfit font-semibold text-sm text-white transition-all hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #085D8A 0%, #2499D6 100%)' }}
          >
            Get Started <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const { isSignedIn, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && isSignedIn) {
      router.replace('/dashboard')
    }
  }, [isSignedIn, loading, router])

  if (loading) return null
  if (isSignedIn) return null

  return (
    <>
      <HeroDemo
        primaryHref="/signin"
        primaryText="Get Started"
        secondaryHref="#events"
        secondaryText="View Events"
      />
      <MissionTicker />
      <LocationEvents />
    </>
  )
}
