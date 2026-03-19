'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Leaf, Laptop, ShoppingBag, Package, Sprout, HeartPulse, Sparkles, BookOpen, Clock, MapPin as MapPinIcon } from 'lucide-react'
import { HeroDemo } from '@/components/ui/animated-hero-demo'
import { supabase } from '@/lib/supabaseClient'

type SupabaseEvent = {
  id: string
  title: string
  description: string
  event_date: string
  start_time: string
  end_time: string
  location_name: string
  event_type: string
  created_at: string
}

const events = [
  {
    id: 'cleanup',
    title: 'Community Cleanup Drive',
    date: 'April 25, 2026',
    time: '10:00 AM - 1:00 PM',
    location: 'Bothell Landing Park, 9919 NE 180th St, Bothell WA',
    audience: 'All ages welcome',
    category: 'Volunteer',
    description: "Join neighbors for a city-wide cleanup. We'll provide gloves, bags, and light refreshments. Meet at the south entrance.",
    day: '25',
    month: 'APR',
    emoji: '🌿',
    color: '#085D8A',
    colorLight: '#EBF7FF',
    colorMid: '#C6EBFF',
    gcalStart: '20260425T100000',
    gcalEnd: '20260425T130000',
  },
  {
    id: 'stem',
    title: 'STEM Mentorship Workshop',
    date: 'May 2, 2026',
    time: '4:00 PM - 6:30 PM',
    location: 'Bothell Regional Library, 18215 98th Ave NE, Bothell WA',
    audience: 'Students 12+',
    category: 'Education',
    description: 'Guest speakers from local universities and hands-on breakout sessions for aspiring STEM students. Hosted at Bothell Regional Library.',
    day: '02',
    month: 'MAY',
    emoji: '💻',
    color: '#044069',
    colorLight: '#EBF7FF',
    colorMid: '#90D4F7',
    gcalStart: '20260502T160000',
    gcalEnd: '20260502T183000',
  },
  {
    id: 'food',
    title: 'Northshore Food Drive',
    date: 'May 16, 2026',
    time: '9:00 AM - 4:00 PM',
    location: 'Hopelink Bothell, 23640 Bothell Everett Hwy, Bothell WA',
    audience: 'All community members',
    category: 'Donation',
    description: 'Help stock the Hopelink Bothell food bank. Drop off non-perishable items: canned goods, rice, pasta, and baby supplies most needed.',
    day: '16',
    month: 'MAY',
    emoji: '🥫',
    color: '#2499D6',
    colorLight: '#EBF7FF',
    colorMid: '#C6EBFF',
    gcalStart: '20260516T090000',
    gcalEnd: '20260516T160000',
  },
  {
    id: 'clothing',
    title: 'Clothing & Essentials Drive',
    date: 'May 30, 2026',
    time: '10:00 AM - 3:00 PM',
    location: 'Bothell City Hall, 18415 101st Ave NE, Bothell WA',
    audience: 'All ages',
    category: 'Donation',
    description: 'Donate gently used clothing, shoes, and household essentials. Items go directly to Northshore families served by local nonprofits.',
    day: '30',
    month: 'MAY',
    emoji: '🧥',
    color: '#022747',
    colorLight: '#EBF7FF',
    colorMid: '#90D4F7',
    gcalStart: '20260530T100000',
    gcalEnd: '20260530T150000',
  },
  {
    id: 'garden',
    title: 'Community Garden Workshop',
    date: 'June 6, 2026',
    time: '9:00 AM - 12:00 PM',
    location: 'Bothell Community Garden, 5th & Maple, Bothell WA',
    audience: 'All ages',
    category: 'Community',
    description: 'Learn sustainable gardening, composting, and organic growing techniques with the Northshore Community Garden. Tools provided. Beginners welcome.',
    day: '06',
    month: 'JUN',
    emoji: '🌱',
    color: '#085D8A',
    colorLight: '#EBF7FF',
    colorMid: '#C6EBFF',
    gcalStart: '20260606T090000',
    gcalEnd: '20260606T120000',
  },
  {
    id: 'health',
    title: 'Senior Health & Wellness Fair',
    date: 'June 20, 2026',
    time: '10:00 AM - 2:00 PM',
    location: 'Northshore Senior Center, 10201 E Riverside Dr, Bothell WA',
    audience: 'Seniors 60+',
    category: 'Health',
    description: 'Free health screenings, fitness demos, nutrition workshops, and social activities for seniors at the Northshore Senior Center. Lunch provided.',
    day: '20',
    month: 'JUN',
    emoji: '💙',
    color: '#044069',
    colorLight: '#EBF7FF',
    colorMid: '#90D4F7',
    gcalStart: '20260620T100000',
    gcalEnd: '20260620T140000',
  },
  {
    id: 'block',
    title: 'Bothell Independence Day Celebration',
    date: 'July 4, 2026',
    time: '12:00 PM - 9:00 PM',
    location: 'Bothell Landing Park, 9919 NE 180th St, Bothell WA',
    audience: 'All families',
    category: 'Community',
    description: "Celebrate Independence Day at Bothell Landing! Live music, food vendors, kids' activities, and the City of Bothell's annual fireworks display. Free admission.",
    day: '04',
    month: 'JUL',
    emoji: '🎆',
    color: '#2499D6',
    colorLight: '#EBF7FF',
    colorMid: '#C6EBFF',
    gcalStart: '20260704T120000',
    gcalEnd: '20260704T210000',
  },
  {
    id: 'school',
    title: 'Back-to-School Supply Drive',
    date: 'August 8, 2026',
    time: '10:00 AM - 3:00 PM',
    location: 'Northshore Volunteer Services, 6809 228th St SW, Mountlake Terrace WA',
    audience: 'Students K-12',
    category: 'Donation',
    description: 'Donate backpacks, notebooks, pencils, and school supplies for Northshore students in need. Organized by Northshore Volunteer Services.',
    day: '08',
    month: 'AUG',
    emoji: '🎒',
    color: '#022747',
    colorLight: '#EBF7FF',
    colorMid: '#90D4F7',
    gcalStart: '20260808T100000',
    gcalEnd: '20260808T150000',
  },
]

const eventIcons: Record<string, React.ElementType> = {
  cleanup: Leaf,
  stem: Laptop,
  food: ShoppingBag,
  clothing: Package,
  garden: Sprout,
  health: HeartPulse,
  block: Sparkles,
  school: BookOpen,
}

type EventType = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  audience: string;
  category: string;
  description: string;
  day: string;
  month: string;
  emoji: string;
  color: string;
  colorLight: string;
  colorMid: string;
  gcalStart: string;
  gcalEnd: string;
}

export type { EventType }

function getGCalUrl(event: EventType) {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${event.gcalStart}/${event.gcalEnd}`,
    details: event.description,
    location: event.location,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

function getMapsUrl(location: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`
}

function EventIconDisplay({ id, dark = true, size = 'lg' }: { id: string; dark?: boolean; size?: 'sm' | 'lg' }) {
  const Icon = eventIcons[id] ?? Sparkles
  const s = size === 'lg' ? 'w-8 h-8' : 'w-5 h-5'
  const wrapSize = size === 'lg' ? 'w-16 h-16' : 'w-10 h-10'
  return (
    <div className={`${wrapSize} rounded-2xl flex items-center justify-center flex-shrink-0 ${dark ? 'bg-white/20 border border-white/30' : 'bg-sky-100 border border-sky-200'}`}>
      <Icon className={`${s} ${dark ? 'text-white' : 'text-sky-600'}`} strokeWidth={1.5} />
    </div>
  )
}

function PinnedCalendar({ events, selected, onSelect }: { events: EventType[]; selected: EventType | null; onSelect: (event: EventType | null) => void }) {
  const pinnedDates = events.map(e => parseInt(e.day))
  // April 2026: 30 days, starts on Wednesday (offset = 3)
  const daysInMonth = 30
  const startOffset = 3
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const dayLabels = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  const getEventForDay = (day: number) => events.find(e => parseInt(e.day) === day)

  return (
    <div>
      <div className="text-center mb-3 font-bold text-sky-800 text-sm" style={{ fontFamily: 'var(--font-syne)' }}>April 2026</div>
      <div className="grid grid-cols-7 gap-1.5 text-center">
        {dayLabels.map(day => (
          <div key={day} className="py-2 text-xs font-bold uppercase text-slate-500 tracking-wider" style={{ fontFamily: 'var(--font-space)' }}>
            {day}
          </div>
        ))}
        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {days.map(day => {
          const isPinned = pinnedDates.includes(day)
          const event = getEventForDay(day)
          const isSelected = selected && event && selected.id === event.id

          return (
            <motion.div
              key={day}
              className={`relative p-2 rounded-xl cursor-pointer transition-all duration-300 h-14 flex items-center justify-center font-semibold text-sm ${
                isSelected ? 'border-2 shadow-lg' :
                isPinned ? 'bg-gradient-to-br from-sky-400/30 to-sky-500/30 border-2 border-sky-300 shadow-lg hover:shadow-xl' :
                'hover:bg-sky-50/50 border border-sky-100 hover:border-sky-200 hover:shadow-md'
              }`}
              style={{
                fontFamily: 'var(--font-space)',
                ...(isSelected ? { backgroundColor: event!.color, borderColor: event!.color } : {}),
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => event ? onSelect(isSelected ? null : event) : undefined}
            >
              <span className={`font-bold ${isSelected ? 'text-white' : isPinned ? 'text-sky-700' : 'text-slate-600'}`}>
                {day}
              </span>
              {isPinned && !isSelected && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-sky-400 border-2 border-white shadow-sm" />
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function EventModal({ event, onClose }: { event: EventType; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(2,39,71,0.6)', backdropFilter: 'blur(12px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-lg bg-white rounded-2xl overflow-hidden"
        style={{ boxShadow: '0 32px 80px rgba(2,39,71,0.25)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="relative p-8 pb-6" style={{ backgroundColor: event.color }}>
          <div className="flex items-start justify-between">
            <div>
              <span
                className="inline-block text-xs font-bold uppercase tracking-widest mb-3 px-3 py-1 rounded-full border"
                style={{ color: event.colorMid, borderColor: `${event.colorMid}40`, backgroundColor: 'rgba(255,255,255,0.1)', fontFamily: 'var(--font-space)' }}
              >
                {event.category}
              </span>
              <h2 style={{ fontFamily: 'var(--font-syne)', fontSize: '22px', fontWeight: 800, color: 'white', lineHeight: 1.2, maxWidth: '260px' }}>
                {event.title}
              </h2>
            </div>
            <div className="ml-4 flex-shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center">
                {(() => { const Icon = eventIcons[event.id] ?? Sparkles; return <Icon className="w-7 h-7 text-white" strokeWidth={1.5} /> })()}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white/70 hover:bg-white/25 transition-all"
            style={{ fontFamily: 'var(--font-space)', fontSize: '13px', fontWeight: 600 }}
          >✕</button>
        </div>

        <div className="p-8">
          <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '14px', color: '#64748b', lineHeight: 1.7, marginBottom: '24px' }}>
            {event.description}
          </p>

          <div className="grid grid-cols-2 gap-2 mb-6">
            {[
              { label: 'Date', value: event.date },
              { label: 'Time', value: event.time },
              { label: 'Location', value: event.location.split(',')[0] },
              { label: 'Who', value: event.audience },
            ].map(item => (
              <div key={item.label} className="rounded-xl p-3 border border-slate-100 bg-slate-50">
                <div style={{ fontFamily: 'var(--font-space)', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8', marginBottom: '4px' }}>
                  {item.label}
                </div>
                <div style={{ fontFamily: 'var(--font-space)', fontSize: '12px', fontWeight: 600, color: '#1e293b' }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <a
              href={getMapsUrl(event.location)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-3 rounded-xl text-white transition-all hover:opacity-90 text-center"
              style={{ backgroundColor: event.color, fontFamily: 'var(--font-space)', fontSize: '13px', fontWeight: 600 }}
            >
              📍 Get Directions
            </a>
            <a
              href={getGCalUrl(event)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all text-center"
              style={{ fontFamily: 'var(--font-space)', fontSize: '13px', fontWeight: 600, color: '#64748b' }}
            >
              📅 Add to Calendar
            </a>
            <button
              onClick={onClose}
              className="px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all"
              style={{ fontFamily: 'var(--font-space)', fontSize: '13px', fontWeight: 600, color: '#64748b' }}
            >
              ✕
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function EventsPage() {
  const [allEvents, setAllEvents] = useState<EventType[]>(events)
  const [selected, setSelected] = useState<EventType | null>(null)
  const [calendarSelected, setCalendarSelected] = useState<EventType | null>(null)
  const [showAll, setShowAll] = useState(false)
  const [loading, setLoading] = useState(true)

  // Fetch future events
  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .gte('event_date', new Date().toISOString().split('T')[0])
          .order('event_date', { ascending: true })
          .order('start_time', { ascending: true })

        if (error) throw new Error(`Supabase error: ${error.message || 'Unknown'} (code: ${error.code || 'N/A'})`)

        // Transform only if data exists
        const transformed: EventType[] = data?.map((e: SupabaseEvent) => ({
          id: e.id,
          title: e.title,
          date: e.event_date,
          time: `${e.start_time} - ${e.end_time || 'TBD'}`,
          location: e.location_name,
          audience: 'Public',
          category: e.event_type || 'Community',
          description: e.description || 'Community event',
          day: e.event_date.split('-')[2],
          month: new Date(e.event_date).toLocaleString('default', { month: 'short' }).toUpperCase(),
          emoji: '📅',
          color: '#085D8A',
          colorLight: '#EBF7FF',
          colorMid: '#C6EBFF',
          gcalStart: `${e.event_date}T${e.start_time.replace(':', '')}00`,
          gcalEnd: e.end_time ? `${e.event_date}T${e.end_time.replace(':', '')}00` : `${e.event_date}T${e.start_time.replace(':', '')}00`,
        }))

        // Merge & sort by date
        const mergedAndSorted = [
          ...events, 
          ...transformed
        ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

        setAllEvents(mergedAndSorted)
      // AFTER
} catch (err: any) {
  console.error('Events fetch error:', err?.message ?? err ?? 'Unknown error');


        console.warn('Using hardcoded events fallback. Setup Supabase: env vars + schema.sql + future test data.');
        // Fallback to hardcoded
        setAllEvents(events)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])
  // TODO: Console error fixed. Follow next-community-connect/TODO.md for full Supabase setup

  const visibleEvents = showAll ? allEvents : allEvents.slice(0, 4)

  return (
    <>
      <HeroDemo
        badge="Always Something Happening"
        staticTitle="Upcoming Events"
        subtitle="Stay connected with what is happening in our community. From cleanups to workshops, there is a place for everyone."
        backgroundImage="/img/page-3.jpg"
      />

      {/* Calendar + Map */}
      <section className="events-calendar-section py-16 lg:py-20 bg-gradient-to-br from-slate-50/50 to-sky-50/30 border-b border-sky-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span style={{ fontFamily: 'var(--font-space)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#085D8A', display: 'inline-block', marginBottom: '8px' }}>
              April through August 2026
            </span>
            <h3 style={{ fontFamily: 'var(--font-syne)', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: '#022747', lineHeight: 1.1 }}>
              Next Events Pinned
            </h3>
          </motion.div>

          <div className="max-w-3xl mx-auto backdrop-blur-xl bg-white rounded-3xl border border-sky-100 p-6 lg:p-8 shadow-card">
            <PinnedCalendar events={events.slice(0, 4)} selected={calendarSelected} onSelect={setCalendarSelected} />
          </div>

          {/* Calendar event detail panel */}
          <AnimatePresence>
            {calendarSelected && (
              <motion.div
                key={calendarSelected.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="mt-6 rounded-3xl overflow-hidden border border-sky-100 shadow-card"
                style={{ backgroundColor: 'white' }}
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Color sidebar */}
                  <div className="lg:w-72 flex-shrink-0 p-8 flex flex-col justify-between" style={{ backgroundColor: calendarSelected.color }}>
                    <div>
                      <span className="inline-block text-xs font-bold uppercase tracking-widest mb-4 px-3 py-1 rounded-full"
                        style={{ color: calendarSelected.colorMid, backgroundColor: 'rgba(255,255,255,0.15)', fontFamily: 'var(--font-space)' }}>
                        {calendarSelected.category}
                      </span>
                      <h3 style={{ fontFamily: 'var(--font-syne)', fontSize: 'clamp(22px, 2.5vw, 30px)', fontWeight: 800, color: 'white', lineHeight: 1.15, letterSpacing: '-0.5px', marginBottom: '16px' }}>
                        {calendarSelected.title}
                      </h3>
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                        {(() => { const Icon = eventIcons[calendarSelected.id] ?? Sparkles; return <Icon className="w-8 h-8 text-white" strokeWidth={1.5} /> })()}
                      </div>
                    </div>
                    <div className="mt-8">
                      <span style={{ fontFamily: 'var(--font-syne)', fontSize: '36px', fontWeight: 800, color: 'white', display: 'block', lineHeight: 1 }}>
                        {calendarSelected.day}
                      </span>
                      <span style={{ fontFamily: 'var(--font-space)', fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        {calendarSelected.month} 2026
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 p-8">
                    <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '15px', color: '#64748b', lineHeight: 1.8, marginBottom: '28px' }}>
                      {calendarSelected.description}
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                      {[
                        { label: 'Date', value: calendarSelected.date },
                        { label: 'Time', value: calendarSelected.time },
                        { label: 'Location', value: calendarSelected.location.split(',')[0] },
                        { label: 'Audience', value: calendarSelected.audience },
                      ].map(item => (
                        <div key={item.label} className="rounded-xl p-3 border border-slate-100 bg-slate-50">
                          <div style={{ fontFamily: 'var(--font-space)', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8', marginBottom: '4px' }}>
                            {item.label}
                          </div>
                          <div style={{ fontFamily: 'var(--font-space)', fontSize: '12px', fontWeight: 600, color: '#1e293b' }}>
                            {item.value}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <a
                        href={getMapsUrl(calendarSelected.location)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
                        style={{ backgroundColor: calendarSelected.color, fontFamily: 'var(--font-space)' }}
                      >
                        Get Directions
                      </a>
                      <a
                        href={getGCalUrl(calendarSelected)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 rounded-xl border border-slate-200 text-sm font-semibold hover:bg-slate-50 transition-all"
                        style={{ fontFamily: 'var(--font-space)', color: '#64748b' }}
                      >
                        Add to Calendar
                      </a>
                      <button
                        onClick={() => setCalendarSelected(null)}
                        className="px-6 py-3 rounded-xl border border-slate-200 text-sm font-semibold hover:bg-slate-50 transition-all"
                        style={{ fontFamily: 'var(--font-space)', color: '#94a3b8' }}
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Bento Grid */}
      <section className="events-bento-section py-24 lg:py-32 bg-white" id="events">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <span style={{ fontFamily: 'var(--font-space)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#085D8A', display: 'inline-block', marginBottom: '12px' }}>
              What's Coming Up
            </span>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mt-1">
              <h2 style={{ fontFamily: 'var(--font-syne)', fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 800, color: '#19619f', lineHeight: 1, letterSpacing: '-1px' }}>
                Mark Your<br />Calendar.
              </h2>
              <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '15px', fontWeight: 300, color: '#19619f', maxWidth: '280px', lineHeight: 1.7 }} className="lg:text-right">
                All events are free and open to the public. Click any card for full details.
              </p>
            </div>
          </motion.div>

          {/* First 4 -bento */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">

            {/* Card 1 -tall dark hero */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0 }}
              onClick={() => setSelected(events[0])}
              className="lg:col-span-5 lg:row-span-2 group relative rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between"
              style={{ minHeight: '480px', backgroundColor: events[0].color, boxShadow: '0 4px 24px rgba(4,64,105,0.12)' }}
            >
              <div className="p-8">
                <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-3 py-1.5 mb-6">
                  <span style={{ fontFamily: 'var(--font-space)', fontSize: '11px', fontWeight: 700, color: 'white', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    {events[0].month} {events[0].day}
                  </span>
                </div>
                <div className="mb-6 group-hover:scale-110 transition-transform duration-500 origin-left w-fit">
                  <EventIconDisplay id={events[0].id} dark={true} size="lg" />
                </div>
                <span style={{ fontFamily: 'var(--font-space)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '10px' }}>
                  {events[0].category}
                </span>
                <h3 style={{ fontFamily: 'var(--font-syne)', fontSize: 'clamp(22px, 2.5vw, 30px)', fontWeight: 800, color: 'white', lineHeight: 1.15, marginBottom: '12px', letterSpacing: '-0.5px' }}>
                  {events[0].title}
                </h3>
                <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '14px', fontWeight: 300, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
                  {events[0].description}
                </p>
              </div>
              <div className="border-t border-white/10 px-8 py-5 flex flex-col gap-2">
                {[{ icon: '🕐', text: events[0].time }, { icon: '📍', text: events[0].location.split(',')[0] }, { icon: '👥', text: events[0].audience }].map(item => (
                  <div key={item.text} className="flex items-center gap-2">
                    <span className="text-xs">{item.icon}</span>
                    <span style={{ fontFamily: 'var(--font-space)', fontSize: '12px', fontWeight: 400, color: 'rgba(255,255,255,0.45)' }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.1 }}
              onClick={() => setSelected(events[1])}
              className="lg:col-span-7 event-light-bg group relative rounded-2xl overflow-hidden cursor-pointer border"
              style={{ minHeight: '220px', backgroundColor: events[1].colorLight, borderColor: '#D4E8F4', boxShadow: '0 2px 12px rgba(4,64,105,0.06)' }}
            >
              <div className="p-7 flex h-full">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-1.5 border rounded-full px-3 py-1.5 mb-4" style={{ borderColor: `${events[1].color}25`, backgroundColor: `${events[1].color}08` }}>
                    <span style={{ fontFamily: 'var(--font-space)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: events[1].color }}>
                      {events[1].month} {events[1].day}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-syne)', fontSize: 'clamp(18px, 2vw, 24px)', fontWeight: 800, color: events[1].color, lineHeight: 1.2, marginBottom: '10px' }}>
                    {events[1].title}
                  </h3>
                  <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '13px', fontWeight: 300, color: `${events[1].color}90`, lineHeight: 1.7, marginBottom: '16px' }}>
                    {events[1].description}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {[events[1].time, events[1].location.split(',')[0]].map(t => (
                      <span key={t} style={{ fontFamily: 'var(--font-space)', fontSize: '12px', color: `${events[1].color}60` }}>{t}</span>
                    ))}
                  </div>
                </div>
                <div className="ml-6 flex-shrink-0 self-start group-hover:scale-110 transition-transform duration-500">
                  <EventIconDisplay id={events[1].id} dark={false} size="lg" />
                </div>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.15 }}
              onClick={() => setSelected(events[2])}
              className="lg:col-span-4 group relative rounded-2xl overflow-hidden cursor-pointer"
              style={{ minHeight: '220px', backgroundColor: events[2].color, boxShadow: '0 4px 20px rgba(4,64,105,0.15)' }}
            >
              <div className="p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="inline-flex items-center gap-1.5 bg-white/15 border border-white/20 rounded-full px-3 py-1">
                      <span style={{ fontFamily: 'var(--font-space)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'white' }}>
                        {events[2].month} {events[2].day}
                      </span>
                    </div>
                    <EventIconDisplay id={events[2].id} dark={true} size="sm" />
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-syne)', fontSize: '18px', fontWeight: 800, color: 'white', lineHeight: 1.2 }}>{events[2].title}</h3>
                </div>
                <div className="flex flex-col gap-1.5 mt-4">
                  <span style={{ fontFamily: 'var(--font-space)', fontSize: '12px', color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={10} /> {events[2].time}</span>
                  <span style={{ fontFamily: 'var(--font-space)', fontSize: '12px', color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', gap: '4px' }}><MapPinIcon size={10} /> {events[2].location.split(',')[0]}</span>
                </div>
              </div>
            </motion.div>

            {/* Card 4 */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.2 }}
              onClick={() => setSelected(events[3])}
              className="lg:col-span-3 event-light-bg group relative rounded-2xl overflow-hidden cursor-pointer border"
              style={{ minHeight: '220px', backgroundColor: events[3].colorLight, borderColor: '#D4E8F4', boxShadow: '0 2px 12px rgba(4,64,105,0.06)' }}
            >
              <div className="p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="mb-4">
                    <EventIconDisplay id={events[3].id} dark={false} size="sm" />
                  </div>
                  <div className="inline-flex items-center gap-1.5 border rounded-full px-3 py-1 mb-3" style={{ borderColor: `${events[3].color}25`, backgroundColor: `${events[3].color}08` }}>
                    <span style={{ fontFamily: 'var(--font-space)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: events[3].color }}>
                      {events[3].month} {events[3].day}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-syne)', fontSize: '16px', fontWeight: 800, color: events[3].color, lineHeight: 1.25 }}>{events[3].title}</h3>
                </div>
                <span style={{ fontFamily: 'var(--font-space)', fontSize: '12px', color: `${events[3].color}55` }}>📍 {events[3].location.split(',')[0]}</span>
              </div>
            </motion.div>
          </div>

          {/* Extra events (shown when showAll) */}
          <AnimatePresence>
            {showAll && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                  {events.slice(4).map((event, i) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      onClick={() => setSelected(event)}
                      className={`group relative rounded-2xl overflow-hidden cursor-pointer border hover:-translate-y-1 transition-all duration-300${i % 2 !== 0 ? ' event-light-bg' : ''}`}
                      style={{ minHeight: '200px', backgroundColor: i % 2 === 0 ? event.color : event.colorLight, borderColor: i % 2 === 0 ? 'transparent' : '#D4E8F4', boxShadow: '0 2px 16px rgba(4,64,105,0.1)' }}
                    >
                      <div className="p-6 h-full flex flex-col justify-between">
                        <div>
                          <div className="mb-3">
                            <EventIconDisplay id={event.id} dark={i % 2 === 0} size="sm" />
                          </div>
                          <span style={{ fontFamily: 'var(--font-space)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: i % 2 === 0 ? 'rgba(255,255,255,0.5)' : `${event.color}70`, display: 'block', marginBottom: '6px' }}>
                            {event.month} {event.day} · {event.category}
                          </span>
                          <h3 style={{ fontFamily: 'var(--font-syne)', fontSize: '15px', fontWeight: 800, color: i % 2 === 0 ? 'white' : event.color, lineHeight: 1.25 }}>{event.title}</h3>
                        </div>
                        <span style={{ fontFamily: 'var(--font-space)', fontSize: '11px', color: i % 2 === 0 ? 'rgba(255,255,255,0.45)' : `${event.color}55`, marginTop: '12px', display: 'block' }}>
                          {event.location.split(',')[0]}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* See All / Show Less toggle */}
          <div className="flex justify-center mt-10">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-sky-300 text-sky-700 font-bold hover:bg-sky-50 transition-all"
              style={{ fontFamily: 'var(--font-syne)', fontSize: '14px' }}
            >
              {showAll ? '↑ Show Less' : `See All ${events.length} Events →`}
            </motion.button>
          </div>

        </div>
      </section>

      <AnimatePresence>
        {selected && <EventModal event={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </>
  )
}
