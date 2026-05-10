'use client'

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'

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
  { id: 'donate_all',             emoji: '🏆', title: 'Philanthropy Champion',   description: 'Donated to any 5 community causes.',                             rarity: 'legendary', xp: 500 },
  { id: 'accessibility_advocate', emoji: '♿', title: 'Accessibility Advocate',  description: 'Enabled an accessibility feature for more inclusive use.',       rarity: 'uncommon',  xp: 75  },
  { id: 'full_explorer',          emoji: '🏘️', title: 'Full Explorer',          description: 'Visited every section of the CommunityConnect dashboard.',       rarity: 'rare',      xp: 300 },
  { id: 'favor_posted',           emoji: '📋', title: 'Help Wanted',             description: 'Posted your first favor request to the community.',                rarity: 'common',    xp: 50  },
  { id: 'first_helper',           emoji: '🤝', title: 'Good Neighbor',           description: 'Offered to help with your first community favor.',                 rarity: 'common',    xp: 75  },
  { id: 'helper_3',               emoji: '💪', title: 'Reliable Helper',         description: 'Helped out with 3 community favors.',                             rarity: 'uncommon',  xp: 150 },
  { id: 'helper_10',              emoji: '🌟', title: 'Community Hero',          description: 'Helped out with 10 community favors.',                            rarity: 'rare',      xp: 350 },
  { id: 'super_helper',           emoji: '👑', title: 'Legend of the Community', description: 'Helped out with 25 community favors.',                            rarity: 'legendary', xp: 1000},
]

export const TOTAL_POSSIBLE_XP = ACHIEVEMENTS.reduce((s, a) => s + a.xp, 0)

const EXPLORER_PAGES = ['resources', 'events', 'map', 'submit', 'wishlist', 'settings', 'favors']

function visitedKey(userId: string) { return `cc-visited-pages-${userId}` }
function localKey(userId: string)   { return `cc-achievements-${userId}` }

interface AchievementsContextValue {
  unlocked: string[]
  queue: Achievement[]
  dismissCurrent: () => void
  unlock: (id: string) => void
  markPageVisited: (page: string) => void
  resetAchievements: () => Promise<void>
  totalXp: number
}

const AchievementsContext = createContext<AchievementsContextValue | null>(null)

export function AchievementsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [unlocked, setUnlocked] = useState<string[]>([])
  const [queue, setQueue]       = useState<Achievement[]>([])
  const loadedFor               = useRef<string | null>(null)

  // Load achievements whenever the signed-in user changes
  useEffect(() => {
    if (!user) {
      setUnlocked([])
      setQueue([])
      loadedFor.current = null
      return
    }

    if (loadedFor.current === user.id) return
    loadedFor.current = user.id

    const load = async () => {
      // Demo judge or no real Supabase session → use localStorage
      if (user.id === 'demo-judge-001') {
        try {
          const stored = localStorage.getItem(localKey(user.id))
          setUnlocked(stored ? JSON.parse(stored) : [])
        } catch { setUnlocked([]) }
        return
      }

      await supabase.auth.getSession()
      const { data } = await supabase
        .from('user_achievements')
        .select('achievement_id')
        .eq('user_id', user.id)

      if (data) {
        setUnlocked(data.map((r: { achievement_id: string }) => r.achievement_id))
      }
    }

    load()
  }, [user])

  const unlock = useCallback((id: string) => {
    const achievement = ACHIEVEMENTS.find(a => a.id === id)
    if (!achievement) return

    setUnlocked(prev => {
      if (prev.includes(id)) return prev
      const next = [...prev, id]
      setQueue(q => [...q, achievement])

      if (!user) return next

      if (user.id === 'demo-judge-001') {
        try { localStorage.setItem(localKey(user.id), JSON.stringify(next)) } catch { /* ignore */ }
        return next
      }

      // Persist to Supabase (fire-and-forget)
      supabase.auth.getSession().then(() => {
        supabase.from('user_achievements').insert({
          user_id: user.id,
          achievement_id: id,
        }).then(() => { /* ignore duplicate errors */ })
      })

      return next
    })
  }, [user])

  const dismissCurrent = useCallback(() => {
    setQueue(q => q.slice(1))
  }, [])

  const markPageVisited = useCallback((page: string) => {
    if (!user) return
    try {
      const key = visitedKey(user.id)
      const stored = localStorage.getItem(key)
      const visited: string[] = stored ? JSON.parse(stored) : []
      if (!visited.includes(page)) {
        const next = [...visited, page]
        localStorage.setItem(key, JSON.stringify(next))
        if (EXPLORER_PAGES.every(p => next.includes(p))) {
          unlock('full_explorer')
        }
      }
    } catch { /* ignore */ }
  }, [user, unlock])

  const resetAchievements = useCallback(async () => {
    if (!user) return
    try {
      localStorage.removeItem(localKey(user.id))
      localStorage.removeItem(visitedKey(user.id))
    } catch { /* ignore */ }

    if (user.id !== 'demo-judge-001') {
      await supabase.auth.getSession()
      await supabase.from('user_achievements').delete().eq('user_id', user.id)
    }

    setUnlocked([])
    setQueue([])
    loadedFor.current = null
  }, [user])

  const totalXp = ACHIEVEMENTS.filter(a => unlocked.includes(a.id)).reduce((s, a) => s + a.xp, 0)

  return (
    <AchievementsContext.Provider value={{ unlocked, queue, dismissCurrent, unlock, markPageVisited, resetAchievements, totalXp }}>
      {children}
    </AchievementsContext.Provider>
  )
}

export function useAchievements() {
  const ctx = useContext(AchievementsContext)
  if (!ctx) throw new Error('useAchievements must be inside AchievementsProvider')
  return ctx
}
