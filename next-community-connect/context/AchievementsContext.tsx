'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'

export type Rarity = 'common' | 'uncommon' | 'rare' | 'legendary'

export interface Achievement {
  id: string
  emoji: string
  title: string
  description: string
  rarity: Rarity
  xp: number
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_login',            emoji: '⭐', title: 'First Steps',             description: 'Signed in to CommunityConnect for the first time.',              rarity: 'common',    xp: 50  },
  { id: 'tutorial_complete',      emoji: '🎓', title: 'Quick Learner',           description: 'Completed the full site tutorial.',                              rarity: 'common',    xp: 75  },
  { id: 'explore_resources',      emoji: '📚', title: 'Resource Hunter',         description: 'Visited the Community Resources page.',                          rarity: 'common',    xp: 50  },
  { id: 'explore_events',         emoji: '📅', title: 'Event Seeker',            description: 'Checked out the Community Events Calendar.',                     rarity: 'common',    xp: 50  },
  { id: 'explore_map',            emoji: '🗺️', title: 'Cartographer',           description: 'Explored the Interactive Community Map.',                        rarity: 'uncommon',  xp: 75  },
  { id: 'submit_resource',        emoji: '✉️', title: 'Contributor',            description: 'Submitted a community resource for review.',                     rarity: 'uncommon',  xp: 150 },
  { id: 'ai_approved',            emoji: '🤖', title: 'AI Approved',             description: 'Had a resource approved by the AI moderator.',                   rarity: 'rare',      xp: 200 },
  { id: 'first_donation',         emoji: '❤️', title: 'Generous Soul',          description: 'Made your first donation to a local cause.',                     rarity: 'uncommon',  xp: 100 },
  { id: 'donate_all',             emoji: '🏆', title: 'Philanthropy Champion',   description: 'Donated to all 6 community causes.',                             rarity: 'legendary', xp: 500 },
  { id: 'night_owl',              emoji: '🌙', title: 'Night Owl',               description: 'Enabled dark mode for a better night experience.',               rarity: 'common',    xp: 25  },
  { id: 'polyglot',               emoji: '🌐', title: 'Polyglot',                description: 'Changed the app language to explore new cultures.',              rarity: 'common',    xp: 50  },
  { id: 'accessibility_advocate', emoji: '♿', title: 'Accessibility Advocate',  description: 'Enabled an accessibility feature for more inclusive use.',       rarity: 'uncommon',  xp: 75  },
  { id: 'full_explorer',          emoji: '🏘️', title: 'Full Explorer',          description: 'Visited every section of the CommunityConnect dashboard.',       rarity: 'rare',      xp: 300 },
]

export const TOTAL_POSSIBLE_XP = ACHIEVEMENTS.reduce((s, a) => s + a.xp, 0)

const EXPLORER_PAGES = ['resources', 'events', 'map', 'submit', 'wishlist', 'settings']
const STORAGE_KEY   = 'cc-achievements'
const VISITED_KEY   = 'cc-visited-pages'

interface AchievementsContextValue {
  unlocked: string[]
  queue: Achievement[]
  dismissCurrent: () => void
  unlock: (id: string) => void
  markPageVisited: (page: string) => void
  totalXp: number
}

const AchievementsContext = createContext<AchievementsContextValue | null>(null)

export function AchievementsProvider({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState<string[]>([])
  const [queue, setQueue] = useState<Achievement[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setUnlocked(JSON.parse(stored))
    } catch { /* SSR / private */ }
  }, [])

  const unlock = useCallback((id: string) => {
    const achievement = ACHIEVEMENTS.find(a => a.id === id)
    if (!achievement) return
    setUnlocked(prev => {
      if (prev.includes(id)) return prev
      const next = [...prev, id]
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch { /* ignore */ }
      setQueue(q => [...q, achievement])
      return next
    })
  }, [])

  const dismissCurrent = useCallback(() => {
    setQueue(q => q.slice(1))
  }, [])

  const markPageVisited = useCallback((page: string) => {
    try {
      const stored = localStorage.getItem(VISITED_KEY)
      const visited: string[] = stored ? JSON.parse(stored) : []
      if (!visited.includes(page)) {
        const next = [...visited, page]
        localStorage.setItem(VISITED_KEY, JSON.stringify(next))
        if (EXPLORER_PAGES.every(p => next.includes(p))) {
          unlock('full_explorer')
        }
      }
    } catch { /* ignore */ }
  }, [unlock])

  const totalXp = ACHIEVEMENTS.filter(a => unlocked.includes(a.id)).reduce((s, a) => s + a.xp, 0)

  return (
    <AchievementsContext.Provider value={{ unlocked, queue, dismissCurrent, unlock, markPageVisited, totalXp }}>
      {children}
    </AchievementsContext.Provider>
  )
}

export function useAchievements() {
  const ctx = useContext(AchievementsContext)
  if (!ctx) throw new Error('useAchievements must be inside AchievementsProvider')
  return ctx
}
