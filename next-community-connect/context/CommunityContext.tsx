'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'

export type Community = {
  id: string
  name: string
  city: string
  state: string
}

export const PRESET_COMMUNITIES: Community[] = [
  { id: 'bothell-wa',  name: 'Bothell',  city: 'Bothell',  state: 'WA' },
  { id: 'kirkland-wa', name: 'Kirkland', city: 'Kirkland', state: 'WA' },
  { id: 'seattle-wa',  name: 'Seattle',  city: 'Seattle',  state: 'WA' },
  { id: 'redmond-wa',  name: 'Redmond',  city: 'Redmond',  state: 'WA' },
  { id: 'kenmore-wa',  name: 'Kenmore',  city: 'Kenmore',  state: 'WA' },
  { id: 'bellevue-wa', name: 'Bellevue', city: 'Bellevue', state: 'WA' },
  { id: 'issaquah-wa', name: 'Issaquah', city: 'Issaquah', state: 'WA' },
]

const COMMUNITY_KEY = 'cc-community'

const COMMUNITY_COORDS: { id: string; lat: number; lng: number }[] = [
  { id: 'bothell-wa',  lat: 47.762,  lng: -122.205 },
  { id: 'kirkland-wa', lat: 47.681,  lng: -122.209 },
  { id: 'seattle-wa',  lat: 47.606,  lng: -122.332 },
  { id: 'redmond-wa',  lat: 47.674,  lng: -122.121 },
  { id: 'kenmore-wa',  lat: 47.757,  lng: -122.244 },
  { id: 'bellevue-wa', lat: 47.610,  lng: -122.201 },
  { id: 'issaquah-wa', lat: 47.530,  lng: -122.032 },
]

function closestCommunity(lat: number, lng: number): Community {
  let best = PRESET_COMMUNITIES[0]
  let bestDist = Infinity
  for (const loc of COMMUNITY_COORDS) {
    const dist = Math.sqrt((loc.lat - lat) ** 2 + (loc.lng - lng) ** 2)
    if (dist < bestDist) {
      bestDist = dist
      best = PRESET_COMMUNITIES.find(c => c.id === loc.id) ?? PRESET_COMMUNITIES[0]
    }
  }
  return best
}

interface CommunityContextValue {
  community: Community
  communities: Community[]
  setCommunity: (c: Community) => void
  isDetecting: boolean
  requestLocation: () => void
}

const CommunityContext = createContext<CommunityContextValue | null>(null)

export function CommunityProvider({ children }: { children: React.ReactNode }) {
  const [community, setCommunityState] = useState<Community>(PRESET_COMMUNITIES[0])
  const [isDetecting, setIsDetecting] = useState(false)

  const detectLocation = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) return
    setIsDetecting(true)
    navigator.geolocation.getCurrentPosition(
      pos => {
        const detected = closestCommunity(pos.coords.latitude, pos.coords.longitude)
        setCommunityState(detected)
        try { localStorage.setItem(COMMUNITY_KEY, JSON.stringify(detected)) } catch { /* ignore */ }
        setIsDetecting(false)
      },
      () => { setIsDetecting(false) },
      { timeout: 6000, maximumAge: 300000 }
    )
  }, [])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(COMMUNITY_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as Community
        const known = PRESET_COMMUNITIES.find(c => c.id === parsed.id)
        if (known) { setCommunityState(known); return }
      }
    } catch { /* ignore */ }
    detectLocation()
  }, [detectLocation])

  const setCommunity = useCallback((c: Community) => {
    setCommunityState(c)
    try { localStorage.setItem(COMMUNITY_KEY, JSON.stringify(c)) } catch { /* ignore */ }
  }, [])

  return (
    <CommunityContext.Provider value={{
      community, communities: PRESET_COMMUNITIES,
      setCommunity, isDetecting, requestLocation: detectLocation,
    }}>
      {children}
    </CommunityContext.Provider>
  )
}

export function useCommunity() {
  const ctx = useContext(CommunityContext)
  if (!ctx) throw new Error('useCommunity must be inside CommunityProvider')
  return ctx
}
