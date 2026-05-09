'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useAchievements } from '@/context/AchievementsContext'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Calendar, Clock, Filter, ChevronRight } from 'lucide-react'

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
    date: 'April 25, 2026',
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
    date: 'May 2, 2026',
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

const CATEGORIES = ['All', 'Volunteer', 'Education', 'Donation', 'Community', 'Health']

const CATEGORY_COLORS: Record<string, string> = {
  Volunteer: '#10b981',
  Education: '#8b5cf6',
  Donation: '#f59e0b',
  Community: '#0ea5e9',
  Health: '#ef4444',
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

  const [mounted, setMounted] = useState(false)
  const [filter, setFilter] = useState('All')
  const [activeId, setActiveId] = useState<string | null>(null)
  const [panelOpen, setPanelOpen] = useState(true)

  // Wait for client mount before rendering map (avoids SSR issues)
  useEffect(() => { setMounted(true) }, [])

  // Auth guard
  useEffect(() => {
    if (!loading && !isSignedIn) router.replace('/signin')
  }, [loading, isSignedIn, router])

  useEffect(() => {
    if (isSignedIn) { unlock('explore_map'); markPageVisited('map') }
  }, [isSignedIn, unlock, markPageVisited])

  if (loading || !isSignedIn || !mounted) return null

  const visibleIds = new Set(
    filter === 'All'
      ? EVENTS.map((e) => e.id)
      : EVENTS.filter((e) => e.category === filter).map((e) => e.id)
  )

  const filteredList = filter === 'All' ? EVENTS : EVENTS.filter((e) => e.category === filter)

  return (
    <div className="flex flex-col h-full bg-[#f0f7ff]">
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                              */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-sky-100 bg-white flex-shrink-0">
        <div>
          <h1 className="font-syne text-xl font-bold text-sky-900">Community Map</h1>
          <p className="font-outfit text-xs text-sky-500 mt-0.5">
            {EVENTS.length} upcoming events in the Bothell area
          </p>
        </div>
        <button
          onClick={() => setPanelOpen((v) => !v)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-outfit text-sm text-sky-700 border border-sky-200 hover:bg-sky-50 transition-all"
        >
          <Filter size={14} />
          {panelOpen ? 'Hide list' : 'Show list'}
        </button>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Category filter strip                                               */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex items-center gap-2 px-5 py-3 bg-white border-b border-sky-100 flex-shrink-0 overflow-x-auto">
        {CATEGORIES.map((cat) => {
          const active = filter === cat
          return (
            <button
              key={cat}
              onClick={() => { setFilter(cat); setActiveId(null) }}
              className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-outfit text-xs font-semibold transition-all border"
              style={
                active
                  ? {
                      background: cat === 'All' ? '#0ea5e9' : CATEGORY_COLORS[cat],
                      color: 'white',
                      border: '1px solid transparent',
                    }
                  : {
                      background: 'white',
                      color: '#0369a1',
                      border: '1px solid #bae6fd',
                    }
              }
            >
              {cat !== 'All' && (
                <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ background: CATEGORY_COLORS[cat] }}
                />
              )}
              {cat}
              <span className="ml-0.5 opacity-60 text-[10px]">
                ({cat === 'All' ? EVENTS.length : EVENTS.filter((e) => e.category === cat).length})
              </span>
            </button>
          )
        })}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Map + side panel                                                    */}
      {/* The `isolate` class keeps Leaflet z-indices from escaping upward    */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-1 overflow-hidden relative">
        <div className="flex-1 relative isolate">
          <MapView
            allEvents={EVENTS}
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
              className="w-[300px] flex-shrink-0 flex flex-col bg-white border-l border-sky-100 overflow-y-auto z-10"
            >
              {/* Panel header */}
              <div className="px-4 py-3 border-b border-sky-50 flex-shrink-0">
                <p className="font-outfit text-xs text-sky-400 font-semibold uppercase tracking-wider">
                  {filteredList.length} event{filteredList.length !== 1 ? 's' : ''} shown
                </p>
              </div>

              {/* Event list */}
              <div className="flex-1 overflow-y-auto divide-y divide-sky-50">
                {filteredList.map((ev) => {
                  const isActive = activeId === ev.id
                  return (
                    <button
                      key={ev.id}
                      onClick={() => setActiveId(isActive ? null : ev.id)}
                      className="w-full text-left px-4 py-3.5 hover:bg-sky-50 transition-all group"
                      style={
                        isActive
                          ? { background: '#f0f9ff', borderLeft: `3px solid ${ev.color}` }
                          : {}
                      }
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xl flex-shrink-0 mt-0.5">{ev.emoji}</span>
                        <div className="min-w-0 flex-1">
                          {/* Title row */}
                          <div className="flex items-center justify-between gap-1">
                            <p className="font-space font-bold text-sm text-sky-900 leading-tight truncate">
                              {ev.title}
                            </p>
                            <ChevronRight
                              size={14}
                              className="flex-shrink-0 text-sky-300 group-hover:text-sky-500 transition-colors"
                              style={{
                                transform: isActive ? 'rotate(90deg)' : undefined,
                                transition: 'transform 0.2s',
                              }}
                            />
                          </div>

                          {/* Category badge */}
                          <span
                            className="inline-block mt-1 px-2 py-0.5 rounded-full font-outfit text-[10px] font-semibold text-white"
                            style={{ background: ev.color }}
                          >
                            {ev.category}
                          </span>

                          {/* Date / time / location */}
                          <div className="mt-1.5 space-y-0.5">
                            <div className="flex items-center gap-1.5 font-outfit text-xs text-sky-600">
                              <Calendar size={10} className="flex-shrink-0" />
                              {ev.date}
                            </div>
                            <div className="flex items-center gap-1.5 font-outfit text-xs text-sky-500">
                              <Clock size={10} className="flex-shrink-0" />
                              {ev.time}
                            </div>
                            <div className="flex items-center gap-1.5 font-outfit text-xs text-sky-500">
                              <MapPin size={10} className="flex-shrink-0" />
                              {ev.location}
                            </div>
                          </div>

                          {/* Expandable description */}
                          <AnimatePresence>
                            {isActive && (
                              <motion.p
                                key="desc"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden font-outfit text-xs text-sky-700 mt-2 leading-relaxed"
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
