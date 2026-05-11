'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { HeroDemo } from '@/components/ui/animated-hero-demo'
import { MissionTicker } from '@/components/MissionTicker'
import { Testimonials } from '@/components/Testimonials'
import { HowItWorks } from '@/components/HowItWorks'
import { AboutSections } from '@/components/AboutSections'
import { ZoomParallax } from '@/components/ZoomParallax'

const communityImages = [
  { src: '/img/optimized/heartwithhands6.jpg', alt: 'Hands forming heart community symbol' },
  { src: '/img/optimized/garden2.jpg',         alt: 'Neighborhood garden space' },
  { src: '/img/optimized/library3.jpg',        alt: 'Local library community area' },
  { src: '/img/optimized/cleanup4.jpg',        alt: 'Neighborhood cleanup volunteers' },
  { src: '/img/optimized/foodpantry5.jpg',     alt: 'Community food pantry shelves' },
  { src: '/img/optimized/playground1.jpg',     alt: 'Community playground gathering' },
  { src: '/img/optimized/community7.jpg',      alt: 'General community gathering' },
]
import { useScroll, useTransform } from 'framer-motion'
import { MapPin, CalendarDays, Clock, Search, Gift, PlusCircle, Bot, LayoutDashboard, Map, Users2, Layers, PackageSearch, Trophy } from 'lucide-react'
import Link from 'next/link'
import { useT } from '@/lib/useT'

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
    { emoji: '🌿', name: 'Community Cleanup Drive', date: 'May 25', time: '10am–1pm', location: 'Bothell Landing Park', category: 'Environment' },
    { emoji: '📚', name: 'STEM Mentorship Workshop', date: 'Jun 2', time: '4pm', location: 'Northshore Library', category: 'Education' },
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

// ─── Features section ─────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Search,
    title: 'Resource Directory',
    desc: 'Search and filter 30+ verified local resources across health, education, food, and more.',
    color: '#56BBF0',
    bg: 'rgba(86,187,240,0.08)',
    border: 'rgba(86,187,240,0.18)',
  },
  {
    icon: CalendarDays,
    title: 'Events & Creation',
    desc: 'Browse upcoming community events and create your own, published instantly to the calendar.',
    color: '#A78BFA',
    bg: 'rgba(167,139,250,0.08)',
    border: 'rgba(167,139,250,0.18)',
  },
  {
    icon: Map,
    title: 'Interactive Map',
    desc: 'Explore resources and points of interest on a live map. Filter by category and tap for details.',
    color: '#10B981',
    bg: 'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.18)',
  },
  {
    icon: PackageSearch,
    title: 'Lost & Found',
    desc: 'Post lost or found items with photo uploads, AI-generated descriptions, and direct contact.',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.18)',
  },
  {
    icon: Users2,
    title: 'Social Directory',
    desc: 'Connect with neighbors, view profiles, and find community members who share your interests.',
    color: '#56BBF0',
    bg: 'rgba(86,187,240,0.08)',
    border: 'rgba(86,187,240,0.18)',
  },
  {
    icon: Layers,
    title: 'Community Groups',
    desc: 'Join or create groups around shared interests, neighborhoods, or causes to coordinate together.',
    color: '#A78BFA',
    bg: 'rgba(167,139,250,0.08)',
    border: 'rgba(167,139,250,0.18)',
  },
  {
    icon: Bot,
    title: 'AI Assistant',
    desc: 'Get personalized help finding the right resource, and let AI review and describe your submissions.',
    color: '#FB7185',
    bg: 'rgba(251,113,133,0.08)',
    border: 'rgba(251,113,133,0.18)',
  },
  {
    icon: Gift,
    title: 'Donation Wishlist',
    desc: 'See exactly what local causes need and contribute items or donations directly from your home.',
    color: '#34D399',
    bg: 'rgba(52,211,153,0.08)',
    border: 'rgba(52,211,153,0.18)',
  },
  {
    icon: Trophy,
    title: 'Achievements',
    desc: 'Earn badges as you explore and contribute. Track your community impact on your profile.',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.18)',
  },
]

function FeaturesSection() {
  const t = useT()
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], [60, -60])

  return (
    <section ref={sectionRef} id="features" className="py-20 px-4 bg-[var(--section-bg)] relative overflow-hidden">
      {/* Parallax background orb */}
      <motion.div
        style={{ y: bgY, background: 'radial-gradient(circle at 70% 30%, rgba(86,187,240,0.18) 0%, transparent 60%)' }}
        className="pointer-events-none absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-30"
        aria-hidden="true"
      />
      <div className="max-w-5xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="section-eyebrow">{t('home.features.eyebrow')}</span>
          <h2 className="section-heading mt-2 mb-3">{t('home.features.heading')}</h2>
          <p className="section-subtext max-w-md mx-auto">{t('home.features.subtext')}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, title, desc, color, bg, border }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl p-6 border border-sky-100 hover:border-sky-200 hover:shadow-xl transition-shadow group cursor-default"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                style={{ background: bg, border: `1px solid ${border}` }}
              >
                <Icon size={20} style={{ color }} />
              </div>
              <h3 className="font-syne font-bold text-base text-[var(--text-dark)] mb-1.5">{title}</h3>
              <p className="font-outfit text-sm text-[var(--text-muted)] leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Events section ───────────────────────────────────────────────────────────

function LocationEvents() {
  const t = useT()
  const [loc, setLoc] = useState('bothell')
  const events = EVENTS[loc] ?? []

  return (
    <section id="events" className="lev-section py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center mb-10"
        >
          <span className="section-eyebrow">{t('home.events.eyebrow')}</span>
          <h2 className="lev-heading font-syne text-3xl sm:text-4xl font-bold mt-2 mb-3">
            {t('home.events.heading')}
          </h2>
          <p className="lev-subtext font-outfit text-sm max-w-md mx-auto">
            {t('home.events.subtext')}
          </p>
        </motion.div>

        {/* Location selector */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {LOCATIONS.map((l) => (
            <button
              key={l.id}
              onClick={() => setLoc(l.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-outfit text-sm transition-all duration-200 ${
                loc === l.id ? 'lev-btn-active' : 'lev-btn'
              }`}
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
              <motion.div
                key={ev.name}
                className="lev-card rounded-2xl p-5"
                whileHover={{ scale: 1.015, y: -4 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="lev-icon w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
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
                    <p className="lev-card-title font-syne text-sm font-bold leading-snug">{ev.name}</p>
                  </div>
                </div>
                <div className="space-y-1 pl-0.5">
                  <p className="lev-date flex items-center gap-1.5 font-outfit text-xs">
                    <CalendarDays size={10} /> {ev.date}
                  </p>
                  <p className="lev-meta flex items-center gap-1.5 font-outfit text-xs">
                    <Clock size={10} /> {ev.time}
                  </p>
                  <p className="lev-meta flex items-center gap-1.5 font-outfit text-xs">
                    <MapPin size={10} /> {ev.location}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const t = useT()
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
        primaryText={t('home.hero.primary')}
        secondaryHref="#events"
        secondaryText={t('home.hero.secondary')}
        subtitle="Find nonprofits, support services, events, and volunteers.<br />All in one place, built for every resident."
      />
      <div className="relative z-10">
      <MissionTicker />
      <AboutSections />
      <ZoomParallax images={communityImages} />
      <div id="testimonials"><Testimonials /></div>
      <div id="how-it-works"><HowItWorks /></div>
      <FeaturesSection />
      <LocationEvents />

      {/* ── Get Involved CTA ──────────────────────────────────────────────── */}
      <section id="get-involved" className="py-24 bg-[var(--section-bg)]">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-sky-900 to-sky-700 rounded-2xl p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(36,153,214,0.2)_0%,transparent_60%)]" />
            {/* Floating orbs */}
            <motion.div
              className="pointer-events-none absolute w-48 h-48 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(86,187,240,0.2) 0%, transparent 70%)', top: '-20%', right: '5%' }}
              animate={{ y: [0, -20, 0], scale: [1, 1.12, 1] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="pointer-events-none absolute w-32 h-32 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)', bottom: '-10%', left: '10%' }}
              animate={{ y: [0, 15, 0], scale: [1, 0.9, 1] }}
              transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
            />
            <div className="relative z-10">
              <h2 className="font-space text-3xl font-bold text-white mb-4">{t('home.cta.heading')}</h2>
              <p className="font-outfit text-base text-white/80 max-w-md mx-auto mb-8">
                {t('home.cta.desc')}
              </p>
              <div className="flex justify-center">
                <Link
                  href="/signin"
                  className="px-8 py-3.5 rounded-xl font-outfit font-semibold text-white transition-all hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg, #085D8A 0%, #2499D6 100%)' }}
                >
                  {t('home.cta.btn')}
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      </div>
    </>
  )
}
