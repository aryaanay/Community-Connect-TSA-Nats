'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  BookOpen, CalendarDays, PlusCircle, Heart, Users, Zap,
  ArrowUpRight, MapPin, Clock, CheckCircle2, Star, TrendingUp,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useSettings } from '@/context/SettingsContext'
import { getT } from '@/lib/translations'

const STATS = [
  { label: 'Local Resources', value: '30+', icon: BookOpen, color: '#2499D6' },
  { label: 'Volunteers', value: '150+', icon: Users, color: '#10B981' },
  { label: 'Community Events', value: '4/yr', icon: CalendarDays, color: '#FF8C42' },
  { label: 'Active Causes', value: '6', icon: Heart, color: '#E85D26' },
]

const QUICK_ACTIONS = [
  {
    href: '/submit',
    icon: PlusCircle,
    title: 'Submit a Resource',
    desc: 'Know a great local program? Add it to our directory',
    color: '#10B981',
    bg: 'rgba(16,185,129,0.12)',
    border: 'rgba(16,185,129,0.2)',
  },
  {
    href: '/wishlist',
    icon: Heart,
    title: 'Make a Donation',
    desc: 'Support causes that matter to your neighborhood',
    color: '#E85D26',
    bg: 'rgba(232,93,38,0.12)',
    border: 'rgba(232,93,38,0.2)',
  },
]

const FEATURED_RESOURCES = [
  { name: 'Bothell Regional Library', category: 'Education', location: 'Bothell, WA', icon: '📚' },
  { name: 'Hopelink Bothell', category: 'Community', location: 'Bothell, WA', icon: '🤝' },
  { name: 'EvergreenHealth Medical', category: 'Health', location: 'Kirkland, WA', icon: '💙' },
  { name: 'Northshore Senior Center', category: 'Senior Care', location: 'Bothell, WA', icon: '🌿' },
]

const UPCOMING_EVENTS = [
  { emoji: '🥫', name: 'Northshore Food Drive',        date: 'May 16',  time: '9am–4pm',  location: 'Kenmore Community Center'    },
  { emoji: '🌿', name: 'Community Garden Volunteer Day', date: 'May 24', time: '10am–2pm', location: 'Bothell Landing Park'         },
  { emoji: '📚', name: 'Youth STEM Mentorship Fair',    date: 'Jun 7',   time: '1–4pm',    location: 'Northshore Library'           },
  { emoji: '🏘️', name: 'Neighborhood Resource Fair',   date: 'Jun 21',  time: '11am–3pm', location: 'Bothell City Hall Plaza'      },
  { emoji: '🤝', name: 'Hopelink Fundraiser Walk',      date: 'Jul 12',  time: '8am',      location: 'Kirkland Marina Park'         },
]

// ── Time-of-day theming ──────────────────────────────────────────────────────
type Phase = 'night' | 'dawn' | 'morning' | 'afternoon' | 'dusk' | 'evening'

function getPhase(hour: number): Phase {
  if (hour < 5)  return 'night'
  if (hour < 7)  return 'dawn'
  if (hour < 12) return 'morning'
  if (hour < 17) return 'afternoon'
  if (hour < 20) return 'dusk'
  return 'evening'
}

const PHASE_THEME: Record<Phase, {
  pageBg: string
  rayColor: string | null
  orb1: string; orb2: string; orb3: string
}> = {
  night:     { pageBg: 'linear-gradient(150deg,#01080f 0%,#010d1c 55%,#01080f 100%)', rayColor: null,                   orb1:'rgba(80,50,210,0.22)',  orb2:'rgba(50,20,170,0.13)', orb3:'rgba(110,60,240,0.1)' },
  dawn:      { pageBg: 'linear-gradient(155deg,#0f0703 0%,#1e0e07 42%,#0c1422 100%)', rayColor:'rgba(255,155,55,0.06)', orb1:'rgba(255,115,35,0.24)', orb2:'rgba(255,185,70,0.14)',orb3:'rgba(220,80,20,0.1)'  },
  morning:   { pageBg: 'linear-gradient(150deg,#011629 0%,#022747 60%,#011629 100%)', rayColor:'rgba(255,225,110,0.05)',orb1:'rgba(36,153,214,0.24)', orb2:'rgba(255,215,85,0.14)',orb3:'rgba(56,189,248,0.1)'  },
  afternoon: { pageBg: 'linear-gradient(150deg,#011829 0%,#02325e 60%,#011829 100%)', rayColor:'rgba(175,235,255,0.04)',orb1:'rgba(36,153,214,0.30)', orb2:'rgba(86,187,240,0.17)',orb3:'rgba(56,189,248,0.13)' },
  dusk:      { pageBg: 'linear-gradient(155deg,#0e0702 0%,#1b0d04 38%,#100919 100%)', rayColor:'rgba(255,105,35,0.06)', orb1:'rgba(255,90,18,0.26)',  orb2:'rgba(205,55,115,0.15)',orb3:'rgba(255,145,40,0.1)'  },
  evening:   { pageBg: 'linear-gradient(150deg,#06011a 0%,#0d051e 52%,#06011a 100%)', rayColor: null,                   orb1:'rgba(115,45,215,0.22)', orb2:'rgba(75,20,175,0.14)', orb3:'rgba(150,65,230,0.1)'  },
}

const IMPACT_FACTS = [
  { icon: CheckCircle2, text: 'Every resource is reviewed before publishing' },
  { icon: Star, text: 'Built by community members, for community members' },
  { icon: TrendingUp, text: 'Directory grows every week with community submissions' },
  { icon: Zap, text: 'Real-time updates keep listings always current' },
]

function Card({ children, className = '', style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`rounded-2xl border ${className}`}
      style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02)), rgba(2,39,71,0.55)',
        border: '1px solid rgba(86,187,240,0.15)',
        backdropFilter: 'blur(16px)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export default function DashboardPage() {
  const { user, isSignedIn, loading } = useAuth()
  const { settings } = useSettings()
  const t = getT(settings.language)
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!loading && !isSignedIn && mounted) {
      router.push('/signin?redirect=/dashboard')
    }
  }, [loading, isSignedIn, mounted, router])

  // Scroll parallax — track the <main> element's scroll position
  useEffect(() => {
    const mainEl = scrollRef.current?.closest('[class*="overflow-y-auto"]') as HTMLElement
      ?? document.querySelector('main') as HTMLElement
    if (!mainEl) return
    const onScroll = () => setScrollY(mainEl.scrollTop)
    mainEl.addEventListener('scroll', onScroll, { passive: true })
    return () => mainEl.removeEventListener('scroll', onScroll)
  }, [mounted])

  const h = new Date().getHours()
  const greeting = h < 12 ? t('dash.morning') : h < 17 ? t('dash.afternoon') : t('dash.evening')
  const phase = getPhase(h)
  const theme = PHASE_THEME[phase]
  const showRays  = theme.rayColor !== null
  const showStars = phase === 'night' || phase === 'evening'

  if (loading || !mounted) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]" style={{ color: 'rgba(198,235,255,0.5)' }}>
        <div className="w-5 h-5 rounded-full border-2 border-sky-400/30 border-t-sky-400 animate-spin" />
      </div>
    )
  }

  if (!isSignedIn) return null

  const firstName = user?.email?.split('@')[0] ?? 'there'

  return (
    <div
      ref={scrollRef}
      className="min-h-full px-4 sm:px-6 lg:px-8 py-8"
      style={{ background: theme.pageBg, transition: 'background 1s ease' }}
    >
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Welcome banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card className="p-6 sm:p-8 relative overflow-hidden">
            {/* Parallax orbs — colors follow time of day */}
            <motion.div
              className="pointer-events-none absolute w-64 h-64 rounded-full"
              style={{
                background: `radial-gradient(circle, ${theme.orb1} 0%, transparent 70%)`,
                top: '-40%', right: '-5%',
                transform: `translateY(${scrollY * 0.25}px)`,
              }}
              animate={{ x: [0, 10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="pointer-events-none absolute w-44 h-44 rounded-full"
              style={{
                background: `radial-gradient(circle, ${theme.orb2} 0%, transparent 70%)`,
                bottom: '-30%', right: '30%',
                transform: `translateY(${scrollY * 0.15}px)`,
              }}
              animate={{ x: [0, -8, 0], scale: [1, 0.93, 1] }}
              transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2.5 }}
            />
            <motion.div
              className="pointer-events-none absolute w-32 h-32 rounded-full"
              style={{
                background: `radial-gradient(circle, ${theme.orb3} 0%, transparent 70%)`,
                top: '20%', left: '-5%',
                transform: `translateY(${-scrollY * 0.2}px)`,
              }}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            />

            {/* ── Sun rays (dawn / morning / afternoon / dusk) ─────────────── */}
            {showRays && (
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {/* Source glow — the "sun" off-screen top */}
                <motion.div
                  className="absolute rounded-full"
                  style={{
                    top: '-80px', left: '38%',
                    width: '320px', height: '320px',
                    background: `radial-gradient(circle, ${theme.rayColor?.replace(/[\d.]+\)$/, '0.22)')} 0%, transparent 70%)`,
                  }}
                  animate={{ scale: [1, 1.18, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                />
                {/* Ray bundle — whole group slowly drifts left→right like sun arc */}
                <motion.div
                  className="absolute inset-0"
                  animate={{ x: [0, 28, 0] }}
                  transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {[0, 1, 2, 3, 4, 5].map(i => (
                    <motion.div
                      key={i}
                      className="absolute"
                      style={{
                        top: '-75%',
                        left: `${-22 + i * 19}%`,
                        width: `${9 + (i % 3) * 5}%`,
                        height: '250%',
                        background: `linear-gradient(180deg, transparent 0%, ${theme.rayColor} 28%, ${theme.rayColor} 72%, transparent 100%)`,
                        transform: 'rotate(-16deg)',
                        transformOrigin: 'top center',
                        filter: 'blur(3px)',
                      }}
                      animate={{
                        opacity: [0.3, 0.75 + (i % 3) * 0.18, 0.3],
                        scaleX: [1, 1.07 + (i % 2) * 0.05, 1],
                      }}
                      transition={{ duration: 3.5 + i * 1.1, repeat: Infinity, ease: 'easeInOut', delay: i * 0.7 }}
                    />
                  ))}
                </motion.div>
              </div>
            )}

            {/* ── Starfield + moon glow (night / evening) ──────────────────── */}
            {showStars && (
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {/* Moon glow — slow breathe */}
                <motion.div
                  className="absolute rounded-full"
                  style={{
                    top: '-18%', right: '10%',
                    width: '220px', height: '220px',
                    background: 'radial-gradient(circle, rgba(200,225,255,0.09) 0%, transparent 70%)',
                  }}
                  animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                />
                {/* Stars — twinkle with subtle drift */}
                {Array.from({ length: 40 }, (_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full bg-white"
                    style={{
                      left: `${(i * 37 + 13) % 95}%`,
                      top:  `${(i * 53 + 7)  % 75}%`,
                      width:  i % 4 === 0 ? 2.5 : i % 3 === 0 ? 2 : 1,
                      height: i % 4 === 0 ? 2.5 : i % 3 === 0 ? 2 : 1,
                    }}
                    animate={{
                      opacity: [0.1 + (i % 5) * 0.06, 0.5 + (i % 4) * 0.12, 0.1 + (i % 5) * 0.06],
                      scale:   [1, i % 4 === 0 ? 1.8 : 1.35, 1],
                      x: [0, (i % 2 === 0 ? 1 : -1) * (1 + i % 3), 0],
                      y: [0, (i % 3 === 0 ? -1 : 1) * (1 + i % 2), 0],
                    }}
                    transition={{ duration: 1.8 + (i % 5) * 0.6, repeat: Infinity, ease: 'easeInOut', delay: (i % 9) * 0.28 }}
                  />
                ))}
                {/* Shooting star — streaks every ~10s */}
                <motion.div
                  className="absolute"
                  style={{
                    top: '18%', right: '22%',
                    width: '90px', height: '1.5px',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent)',
                    borderRadius: '2px',
                    transformOrigin: 'right center',
                    rotate: -28,
                  }}
                  animate={{ x: [0, -260], y: [0, 95], opacity: [0, 1, 1, 0], scaleX: [0.2, 1, 0.4, 0] }}
                  transition={{ duration: 0.65, repeat: Infinity, repeatDelay: 10, ease: [0.2, 0, 0.6, 1], delay: 4 }}
                />
              </div>
            )}
            <div className="relative">
              <p className="font-outfit text-sm text-sky-300/70 mb-1">{greeting},</p>
              <h1 className="font-syne text-2xl sm:text-3xl font-bold text-white mb-2">
                {firstName} <span className="text-sky-400">👋</span>
              </h1>
              <p className="font-outfit text-sm leading-relaxed max-w-lg" style={{ color: 'rgba(198,235,255,0.65)' }}>
                {t('dash.welcome')}
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {STATS.map(({ label, value, icon: Icon, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
            >
              <Card className="p-4 sm:p-5">
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: `${color}20`, border: `1px solid ${color}30` }}
                  >
                    <Icon size={16} style={{ color }} />
                  </div>
                </div>
                <p className="font-syne text-2xl font-bold text-white mb-0.5">{value}</p>
                <p className="font-outfit text-xs" style={{ color: 'rgba(198,235,255,0.5)' }}>{label}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <h2 className="font-syne text-base font-bold text-white mb-3 px-0.5">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {QUICK_ACTIONS.map(({ href, icon: Icon, title, desc, color, bg, border }, i) => (
              <motion.div
                key={href}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.06 }}
                whileHover={{ y: -3 }}
              >
                <Link href={href}>
                  <Card className="p-5 h-full hover:border-sky-400/28 transition-all duration-200 group cursor-pointer">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: bg, border: `1px solid ${border}` }}
                    >
                      <Icon size={18} style={{ color }} />
                    </div>
                    <h3 className="font-syne text-sm font-bold text-white mb-1 group-hover:text-sky-200 transition-colors">
                      {title}
                    </h3>
                    <p className="font-outfit text-xs leading-relaxed" style={{ color: 'rgba(198,235,255,0.45)' }}>
                      {desc}
                    </p>
                    <div className="mt-4 flex items-center gap-1" style={{ color }}>
                      <span className="font-outfit text-xs font-semibold">Open</span>
                      <ArrowUpRight size={12} />
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Resources + Events two-column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Featured Resources */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link href="/dashboard/resources" className="block">
            <Card className="p-5 hover:border-sky-400/25 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-syne text-sm font-bold text-white">Featured Resources</h2>
                <span className="font-outfit text-xs text-sky-400 flex items-center gap-0.5">
                  View all <ArrowUpRight size={11} />
                </span>
              </div>
              <div className="space-y-2.5">
                {FEATURED_RESOURCES.map((r) => (
                  <div
                    key={r.name}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/4 transition-colors"
                    style={{ border: '1px solid rgba(86,187,240,0.08)' }}
                  >
                    <span className="text-xl flex-shrink-0 w-8 text-center">{r.icon}</span>
                    <div className="min-w-0">
                      <p className="font-outfit text-sm font-semibold text-white truncate">{r.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className="font-outfit text-[10px] px-1.5 py-0.5 rounded-full"
                          style={{ background: 'rgba(36,153,214,0.15)', color: '#56BBF0', border: '1px solid rgba(86,187,240,0.2)' }}
                        >
                          {r.category}
                        </span>
                        <span className="flex items-center gap-1 font-outfit text-[10px]" style={{ color: 'rgba(198,235,255,0.4)' }}>
                          <MapPin size={9} /> {r.location}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Link>
          </motion.div>

          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.44 }}
          >
            <Link href="/dashboard/events" className="block">
            <Card className="p-5 hover:border-sky-400/25 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-syne text-sm font-bold text-white">Upcoming Events</h2>
                <span className="font-outfit text-xs text-sky-400 flex items-center gap-0.5">
                  View all <ArrowUpRight size={11} />
                </span>
              </div>
              <div className="space-y-2.5">
                {UPCOMING_EVENTS.map((ev) => (
                  <div
                    key={ev.name}
                    className="flex gap-3 p-3 rounded-xl hover:bg-white/4 transition-colors"
                    style={{ border: '1px solid rgba(86,187,240,0.08)' }}
                  >
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                      style={{ background: 'rgba(36,153,214,0.1)', border: '1px solid rgba(86,187,240,0.15)' }}
                    >
                      {ev.emoji}
                    </div>
                    <div className="min-w-0">
                      <p className="font-outfit text-sm font-semibold text-white truncate">{ev.name}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="flex items-center gap-1 font-outfit text-[10px]" style={{ color: '#56BBF0' }}>
                          <CalendarDays size={9} /> {ev.date}
                        </span>
                        <span className="flex items-center gap-1 font-outfit text-[10px]" style={{ color: 'rgba(198,235,255,0.4)' }}>
                          <Clock size={9} /> {ev.time}
                        </span>
                      </div>
                      <p className="font-outfit text-[10px] mt-0.5 flex items-center gap-1" style={{ color: 'rgba(198,235,255,0.35)' }}>
                        <MapPin size={9} /> {ev.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            </Link>
          </motion.div>
        </div>

        {/* Impact/mission banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
        >
          <Card className="p-6 sm:p-8 relative overflow-hidden">
            <div
              className="pointer-events-none absolute inset-0 opacity-25"
              style={{
                background:
                  'radial-gradient(circle at 10% 50%, rgba(16,185,129,0.3) 0%, transparent 50%), radial-gradient(circle at 90% 50%, rgba(36,153,214,0.3) 0%, transparent 50%)',
              }}
            />
            <div className="relative">
              <p className="font-space text-xs font-bold uppercase tracking-[0.18em] mb-3" style={{ color: '#90D4F7' }}>
                Why Community Connect
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {IMPACT_FACTS.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-start gap-3">
                    <Icon size={16} className="flex-shrink-0 mt-0.5" style={{ color: '#56BBF0' }} />
                    <p className="font-outfit text-sm leading-relaxed" style={{ color: 'rgba(198,235,255,0.7)' }}>
                      {text}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-5 border-t flex flex-col sm:flex-row gap-3" style={{ borderColor: 'rgba(86,187,240,0.12)' }}>
                <Link
                  href="/submit"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-outfit text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg, #085D8A 0%, #2499D6 100%)' }}
                >
                  <PlusCircle size={15} /> Submit a Resource
                </Link>
                <Link
                  href="/wishlist"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-outfit text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(86,187,240,0.22)' }}
                >
                  <Heart size={15} /> Donate to a Cause
                </Link>
              </div>
            </div>
          </Card>
        </motion.div>

      </div>
    </div>
  )
}
