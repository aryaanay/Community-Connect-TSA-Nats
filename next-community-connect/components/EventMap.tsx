'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { EventType } from '@/app/events/page'
import 'leaflet/dist/leaflet.css'

export default function EventMap({ events }: { events: EventType[] }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!mounted) {
    return (
      <div
        className="w-full h-[360px] rounded-2xl flex items-center justify-center"
        style={{ background: '#EBF7FF', border: '1px solid #D4E8F4' }}
      >
        <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '14px', color: '#085D8A' }}>
          Loading map...
        </span>
      </div>
    )
  }

  return <MapInner events={events} />
}

function MapInner({ events }: { events: EventType[] }) {
  const mapRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    if (mapRef.current) return // already initialized

    let map: any = null

    import('leaflet').then((L) => {
      if (!containerRef.current) return
      if (mapRef.current) return

      // Fix default icons
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })

      const customIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      })

      map = L.map(containerRef.current).setView([47.761, -122.209], 13)
      mapRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map)

      const locations = [
        { position: [47.7585, -122.2080] as [number, number], event: events[0] },
        { position: [47.7660, -122.2015] as [number, number], event: events[1] },
        { position: [47.7600, -122.2120] as [number, number], event: events[2] },
        { position: [47.7630, -122.2050] as [number, number], event: events[3] },
      ]

      locations.forEach(({ position, event }) => {
        if (!event) return
        L.marker(position, { icon: customIcon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family: sans-serif; min-width: 200px; padding: 4px;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                <span style="font-size: 24px;">${event.emoji}</span>
                <div>
                  <div style="font-weight: 700; font-size: 14px; color: #022747; margin-bottom: 2px;">${event.title}</div>
                  <div style="font-size: 12px; color: #085D8A;">${event.location}</div>
                </div>
              </div>
              <div style="font-size: 12px; color: #64748b; line-height: 1.6;">
                <div>🕐 ${event.time}</div>
                <div>🏷️ ${event.category}</div>
              </div>
            </div>
          `)
      })
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      className="w-full h-[360px] rounded-2xl overflow-hidden shadow-xl relative"
      style={{ border: '1px solid #D4E8F4' }}
    >
      <div ref={containerRef} style={{ height: '100%', width: '100%' }} />

      {/* Legend */}
      <div
        className="absolute top-4 left-4 z-[1000] rounded-xl p-4 shadow-lg"
        style={{ background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(8px)', border: '1px solid #E2EEF7', minWidth: '180px' }}
      >
        <div style={{ fontFamily: 'var(--font-syne)', fontSize: '13px', fontWeight: 700, color: '#022747', marginBottom: '10px' }}>
          Event Locations
        </div>
        {events.map(event => (
          <div key={event.id} className="flex items-center gap-2 py-1.5 px-1 rounded-lg hover:bg-sky-50 transition-colors cursor-pointer">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: event.color }} />
            <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '12px', color: '#044069' }}>
              {event.emoji} {event.location}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}