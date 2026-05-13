'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useAchievements } from '@/context/AchievementsContext'
import { useSettings } from '@/context/SettingsContext'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Calendar, Clock, Filter, ChevronRight } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { useT } from '@/lib/useT'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type MappedEvent = {
  id: string
  title: string
  date: string
  time: string
  location: string
  audience: string
  category: string
  description: string
  emoji: string
  color: string
  lat: number
  lng: number
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const EVENTS: MappedEvent[] = [
  {
    id: 'cleanup',
    title: 'Community Cleanup Drive',
    date: 'May 25, 2026',
    time: '10:00 AM – 1:00 PM',
    location: 'Bothell Landing Park',
    audience: 'All ages',
    category: 'Volunteer',
    description: 'Join neighbors for a city-wide cleanup. Gloves, bags, and light refreshments provided.',
    emoji: '🌿',
    color: '#10b981',
    lat: 47.7621,
    lng: -122.2059,
  },
  {
    id: 'stem',
    title: 'STEM Mentorship Workshop',
    date: 'June 2, 2026',
    time: '4:00 PM – 6:30 PM',
    location: 'Bothell Regional Library',
    audience: 'Students 12+',
    category: 'Education',
    description: 'Guest speakers from local universities and hands-on STEM sessions for curious minds.',
    emoji: '💻',
    color: '#8b5cf6',
    lat: 47.7582,
    lng: -122.2046,
  },
  {
    id: 'food',
    title: 'Northshore Food Drive',
    date: 'May 16, 2026',
    time: '9:00 AM – 4:00 PM',
    location: 'Hopelink Bothell',
    audience: 'All community members',
    category: 'Donation',
    description: 'Help stock the Hopelink food bank with non-perishable items for families in need.',
    emoji: '🥫',
    color: '#f59e0b',
    lat: 47.8117,
    lng: -122.2106,
  },
  {
    id: 'clothing',
    title: 'Clothing & Essentials Drive',
    date: 'May 30, 2026',
    time: '10:00 AM – 3:00 PM',
    location: 'Bothell City Hall',
    audience: 'All ages',
    category: 'Donation',
    description: 'Donate gently used clothing and household essentials to local nonprofits.',
    emoji: '🧥',
    color: '#f59e0b',
    lat: 47.7605,
    lng: -122.2049,
  },
  {
    id: 'garden',
    title: 'Community Garden Workshop',
    date: 'June 6, 2026',
    time: '9:00 AM – 12:00 PM',
    location: 'Bothell Community Garden',
    audience: 'All ages',
    category: 'Community',
    description: 'Learn sustainable gardening and composting techniques. Tools and seeds provided.',
    emoji: '🌱',
    color: '#0ea5e9',
    lat: 47.7632,
    lng: -122.2093,
  },
  {
    id: 'health',
    title: 'Senior Health & Wellness Fair',
    date: 'June 20, 2026',
    time: '10:00 AM – 2:00 PM',
    location: 'Northshore Senior Center',
    audience: 'Seniors 60+',
    category: 'Health',
    description: 'Free health screenings, fitness demonstrations, and nutrition workshops for seniors.',
    emoji: '💙',
    color: '#ef4444',
    lat: 47.7568,
    lng: -122.1918,
  },
  {
    id: 'block',
    title: 'Bothell Independence Day',
    date: 'July 4, 2026',
    time: '12:00 PM – 9:00 PM',
    location: 'Bothell Landing Park',
    audience: 'All families',
    category: 'Community',
    description: 'Live music, food vendors, and the City of Bothell fireworks display over the river.',
    emoji: '🎆',
    color: '#0ea5e9',
    lat: 47.7625,
    lng: -122.2063,
  },
  {
    id: 'school',
    title: 'Back-to-School Supply Drive',
    date: 'August 8, 2026',
    time: '10:00 AM – 3:00 PM',
    location: 'Northshore Volunteer Services',
    audience: 'Students K–12',
    category: 'Donation',
    description: 'Donate backpacks and school supplies for Northshore students in need.',
    emoji: '🎒',
    color: '#f59e0b',
    lat: 47.7879,
    lng: -122.3129,
  },
]

const CATEGORIES = ['All', 'Volunteer', 'Education', 'Donation', 'Community', 'Health', 'Social', 'Sports', 'Arts', 'Other']

const CATEGORY_COLORS: Record<string, string> = {
  Volunteer: '#10b981',
  Education: '#8b5cf6',
  Donation: '#f59e0b',
  Community: '#0ea5e9',
  Health: '#ef4444',
  Social: '#ec4899',
  Sports: '#f97316',
  Arts: '#a855f7',
  Other: '#64748b',
}

// ---------------------------------------------------------------------------
// SVG marker icon helper — uses btoa to create a data URI
// ---------------------------------------------------------------------------

function makeSvgIcon(color: string, active = false): string {
  const size = active ? 38 : 30
  const pinH = size + 8
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${pinH}" viewBox="0 0 30 38">` +
    `<filter id="s"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.35"/></filter>` +
    `<circle cx="15" cy="15" r="13" fill="${color}" filter="url(#s)" opacity="${active ? 1 : 0.92}"/>` +
    `<circle cx="15" cy="15" r="6" fill="white" opacity="0.9"/>` +
    `<polygon points="15,38 9,24 21,24" fill="${color}" opacity="${active ? 1 : 0.92}"/>` +
    `</svg>`
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

// ---------------------------------------------------------------------------
// MapView — isolated Leaflet component
// ---------------------------------------------------------------------------

function MapView({
  allEvents,
  visibleIds,
  activeId,
  onMarkerClick,
}: {
  allEvents: MappedEvent[]
  visibleIds: Set<string>
  activeId: string | null
  onMarkerClick: (id: string) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markersRef = useRef<Record<string, any>>({})

  // Initialize the map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    import('leaflet').then((L) => {
      if (!containerRef.current || mapRef.current) return

      delete (L.Icon.Default.prototype as any)._getIconUrl

      const map = L.map(containerRef.current, { zoomControl: false }).setView([47.778, -122.22], 12)
      mapRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)

      L.control.zoom({ position: 'bottomright' }).addTo(map)

      allEvents.forEach((ev) => {
        const icon = L.icon({
          iconUrl: makeSvgIcon(ev.color),
          iconSize: [30, 38],
          iconAnchor: [15, 38],
          popupAnchor: [0, -40],
        })

        const marker = L.marker([ev.lat, ev.lng], { icon })
          .addTo(map)
          .bindPopup(
            `<div style="font-family:sans-serif;min-width:220px;padding:2px">` +
            `<div style="font-size:22px;margin-bottom:6px">${ev.emoji}</div>` +
            `<div style="font-weight:700;font-size:14px;color:#022747;margin-bottom:4px">${ev.title}</div>` +
            `<div style="font-size:12px;color:#085D8A;margin-bottom:6px">📍 ${ev.location}</div>` +
            `<div style="font-size:11px;color:#64748b;line-height:1.7">` +
            `<div>📅 ${ev.date}</div>` +
            `<div>🕐 ${ev.time}</div>` +
            `<div>👥 ${ev.audience}</div>` +
            `<div style="margin-top:6px;padding-top:6px;border-top:1px solid #e2e8f0;color:#475569">${ev.description}</div>` +
            `</div></div>`,
            { maxWidth: 260 }
          )

        marker.on('click', () => onMarkerClick(ev.id))
        markersRef.current[ev.id] = marker
      })
    })

    return () => {
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null }
      markersRef.current = {}
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Show/hide markers based on category filter
  useEffect(() => {
    if (!mapRef.current) return
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const map = mapRef.current
      if (!map) return
      if (visibleIds.has(id)) {
        if (!map.hasLayer(marker)) marker.addTo(map)
      } else {
        if (map.hasLayer(marker)) map.removeLayer(marker)
      }
    })
  }, [visibleIds])

  // Update active marker icon and fly to it
  useEffect(() => {
    if (!mapRef.current) return
    import('leaflet').then((L) => {
      Object.entries(markersRef.current).forEach(([id, marker]) => {
        const ev = allEvents.find((e) => e.id === id)
        if (!ev) return
        const isActive = id === activeId
        marker.setIcon(
          L.icon({
            iconUrl: makeSvgIcon(ev.color, isActive),
            iconSize: isActive ? [38, 46] : [30, 38],
            iconAnchor: isActive ? [19, 46] : [15, 38],
            popupAnchor: [0, -44],
          })
        )
        if (isActive) {
          mapRef.current.flyTo([ev.lat, ev.lng], 15, { duration: 0.9 })
          marker.openPopup()
        }
      })
    })
  }, [activeId, allEvents])

  return <div ref={containerRef} style={{ height: '100%', width: '100%' }} />
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function DashboardMapPage() {
  const { isSignedIn, loading } = useAuth()
  const router = useRouter()
  const { unlock, markPageVisited } = useAchievements()
  const { settings } = useSettings()
  const dark = settings.dark
  const tr = useT()

  const colors = {
    pageBg:        dark ? '#011629'                      : '#f0f7ff',
    headerBg:      dark ? '#022747'                      : '#ffffff',
    headerBorder:  dark ? 'rgba(86,187,240,0.15)'        : '#e0f2fe',
    heading:       dark ? '#C6EBFF'                      : '#0c4a6e',
    subtext:       dark ? 'rgba(86,187,240,0.65)'        : '#38bdf8',
    btnBg:         dark ? 'rgba(2,39,71,0.80)'           : '#ffffff',
    btnBorder:     dark ? 'rgba(86,187,240,0.25)'        : '#bae6fd',
    btnText:       dark ? '#90D4F7'                      : '#0369a1',
    btnHoverBg:    dark ? 'rgba(4,64,105,0.70)'          : '#f0f9ff',
    filterBg:      dark ? '#011e38'                      : '#ffffff',
    filterBorder:  dark ? 'rgba(86,187,240,0.15)'        : '#e0f2fe',
    catInactiveBg: dark ? 'rgba(2,39,71,0.60)'           : '#ffffff',
    catInactiveClr:dark ? '#90D4F7'                      : '#0369a1',
    catInactiveBdr:dark ? 'rgba(86,187,240,0.22)'        : '#bae6fd',
    panelBg:       dark ? '#022747'                      : '#ffffff',
    panelBorder:   dark ? 'rgba(86,187,240,0.15)'        : '#e0f2fe',
    panelHdr:      dark ? 'rgba(86,187,240,0.50)'        : '#7dd3fc',
    itemDivide:    dark ? 'rgba(86,187,240,0.10)'        : '#f0f9ff',
    itemHoverBg:   dark ? 'rgba(4,64,105,0.45)'          : '#f0f9ff',
    itemActiveBg:  dark ? 'rgba(4,64,105,0.65)'          : '#f0f9ff',
    itemTitle:     dark ? '#C6EBFF'                      : '#0c4a6e',
    itemMeta:      dark ? '#90D4F7'                      : '#0284c7',
    itemMuted:     dark ? 'rgba(86,187,240,0.60)'        : '#38bdf8',
    itemDesc:      dark ? '#90D4F7'                      : '#0369a1',
    chevron:       dark ? 'rgba(86,187,240,0.35)'        : '#bae6fd',
  }

  const [mounted, setMounted] = useState(false)
  const [filter, setFilter] = useState('All')
  const [activeId, setActiveId] = useState<string | null>(null)
  const [panelOpen, setPanelOpen] = useState(true)
  const [userEvents, setUserEvents] = useState<MappedEvent[]>([])

  // Wait for client mount before rendering map (avoids SSR issues)
  useEffect(() => { setMounted(true) }, [])

  // Auth guard
  useEffect(() => {
    if (!loading && !isSignedIn) router.replace('/signin')
  }, [loading, isSignedIn, router])

  useEffect(() => {
    if (isSignedIn) { unlock('explore_map'); markPageVisited('map') }
  }, [isSignedIn, unlock, markPageVisited])

  useEffect(() => {
    if (!isSignedIn) return
    ;(async () => {
      try {
        const { data } = await supabase
          .from('user_events')
          .select('*')
          .eq('is_public', true)
        if (!data) return
        setUserEvents(data.map((e: any, i: number) => {
          const seed = parseInt((e.id as string).replace(/-/g, '').slice(0, 8), 16) || i
          const latOff = ((seed % 200) - 100) * 0.00015
          const lngOff = (((seed >> 8) % 200) - 100) * 0.00018
          return {
            id: `user-${e.id}`,
            title: e.title,
            date: e.date || '',
            time: e.time || '',
            location: e.location || 'Bothell, WA',
            audience: 'Community',
            category: e.category || 'Community',
            description: e.description || '',
            emoji: e.emoji || '📅',
            color: '#7C3AED',
            lat: 47.7623 + latOff,
            lng: -122.2054 + lngOff,
          } as MappedEvent
        }))
      } catch { /* table may not exist yet */ }
    })()
  }, [isSignedIn])

  if (loading || !isSignedIn || !mounted) return null

  const today = new Date(); today.setHours(0, 0, 0, 0)
  const allEvents = [...EVENTS, ...userEvents].filter(e => {
    const d = new Date(e.date); return isNaN(d.getTime()) || d >= today
  })

  const visibleIds = new Set(
    filter === 'All'
      ? allEvents.map((e) => e.id)
      : allEvents.filter((e) => e.category === filter).map((e) => e.id)
  )

  const filteredList = filter === 'All' ? allEvents : allEvents.filter((e) => e.category === filter)

  return (
    <div className="flex flex-col h-full" style={{ background: colors.pageBg }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0"
        style={{ background: colors.headerBg, borderColor: colors.headerBorder }}
      >
        <div>
          <h1 className="font-syne text-xl font-bold" style={{ color: colors.heading }}>{tr('map.title')}</h1>
          <p className="font-outfit text-xs mt-0.5" style={{ color: colors.subtext }}>
            {allEvents.length} {tr('map.subtitle')}
          </p>
        </div>
        <button
          onClick={() => setPanelOpen((v) => !v)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-outfit text-sm border transition-all"
          style={{ background: colors.btnBg, borderColor: colors.btnBorder, color: colors.btnText }}
        >
          <Filter size={14} />
          {panelOpen ? tr('map.hide_list') : tr('map.show_list')}
        </button>
      </div>

      {/* Category filter strip */}
      <div
        className="flex items-center gap-2 px-5 py-3 border-b flex-shrink-0 overflow-x-auto"
        style={{ background: colors.filterBg, borderColor: colors.filterBorder }}
      >
        {CATEGORIES.map((cat) => {
          const active = filter === cat
          return (
            <button
              key={cat}
              onClick={() => { setFilter(cat); setActiveId(null) }}
              className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-outfit text-xs font-semibold transition-all border"
              style={
                active
                  ? { background: cat === 'All' ? '#0ea5e9' : CATEGORY_COLORS[cat], color: 'white', border: '1px solid transparent' }
                  : { background: colors.catInactiveBg, color: colors.catInactiveClr, border: `1px solid ${colors.catInactiveBdr}` }
              }
            >
              {cat !== 'All' && (
                <span className="w-2 h-2 rounded-full inline-block" style={{ background: CATEGORY_COLORS[cat] }} />
              )}
              {cat}
              <span className="ml-0.5 opacity-60 text-[10px]">
                ({cat === 'All' ? allEvents.length : allEvents.filter((e) => e.category === cat).length})
              </span>
            </button>
          )
        })}
      </div>

      {/* Map + side panel */}
      <div className="flex flex-1 overflow-hidden relative">
        <div className="flex-1 relative isolate">
          <MapView
            allEvents={allEvents}
            visibleIds={visibleIds}
            activeId={activeId}
            onMarkerClick={setActiveId}
          />
        </div>

        <AnimatePresence>
          {panelOpen && (
            <motion.aside
              key="event-panel"
              initial={{ x: 320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 320, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="w-[300px] flex-shrink-0 flex flex-col border-l overflow-y-auto z-10"
              style={{ background: colors.panelBg, borderColor: colors.panelBorder }}
            >
              {/* Panel header */}
              <div className="px-4 py-3 border-b flex-shrink-0" style={{ borderColor: colors.itemDivide }}>
                <p className="font-outfit text-xs font-semibold uppercase tracking-wider" style={{ color: colors.panelHdr }}>
                  {filteredList.length} {filteredList.length !== 1 ? tr('map.events_shown') : tr('map.event_shown')}
                </p>
              </div>

              {/* Event list */}
              <div className="flex-1 overflow-y-auto" style={{ borderColor: colors.itemDivide }}>
                {filteredList.map((ev) => {
                  const isActive = activeId === ev.id
                  return (
                    <button
                      key={ev.id}
                      onClick={() => setActiveId(isActive ? null : ev.id)}
                      className="w-full text-left px-4 py-3.5 transition-all group border-b"
                      style={{
                        borderColor: colors.itemDivide,
                        background: isActive ? colors.itemActiveBg : undefined,
                        borderLeft: isActive ? `3px solid ${ev.color}` : undefined,
                      }}
                      onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = colors.itemHoverBg }}
                      onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = '' }}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xl flex-shrink-0 mt-0.5">{ev.emoji}</span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <p className="font-space font-bold text-sm leading-tight truncate" style={{ color: colors.itemTitle }}>
                              {ev.title}
                            </p>
                            <ChevronRight
                              size={14}
                              className="flex-shrink-0 transition-colors"
                              style={{
                                color: colors.chevron,
                                transform: isActive ? 'rotate(90deg)' : undefined,
                                transition: 'transform 0.2s',
                              }}
                            />
                          </div>

                          <span
                            className="inline-block mt-1 px-2 py-0.5 rounded-full font-outfit text-[10px] font-semibold text-white"
                            style={{ background: ev.color }}
                          >
                            {ev.category}
                          </span>

                          <div className="mt-1.5 space-y-0.5">
                            <div className="flex items-center gap-1.5 font-outfit text-xs" style={{ color: colors.itemMeta }}>
                              <Calendar size={10} className="flex-shrink-0" />{ev.date}
                            </div>
                            <div className="flex items-center gap-1.5 font-outfit text-xs" style={{ color: colors.itemMuted }}>
                              <Clock size={10} className="flex-shrink-0" />{ev.time}
                            </div>
                            <div className="flex items-center gap-1.5 font-outfit text-xs" style={{ color: colors.itemMuted }}>
                              <MapPin size={10} className="flex-shrink-0" />{ev.location}
                            </div>
                          </div>

                          <AnimatePresence>
                            {isActive && (
                              <motion.p
                                key="desc"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden font-outfit text-xs mt-2 leading-relaxed"
                                style={{ color: colors.itemDesc }}
                              >
                                {ev.description}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
