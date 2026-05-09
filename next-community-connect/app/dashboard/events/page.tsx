'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useAchievements } from '@/context/AchievementsContext'
import EventsPage from '@/app/events/page'

export default function DashboardEventsPage() {
  const { isSignedIn, loading } = useAuth()
  const router = useRouter()
  const { unlock, markPageVisited } = useAchievements()

  useEffect(() => {
    if (!loading && !isSignedIn) router.replace('/signin')
  }, [isSignedIn, loading, router])

  useEffect(() => {
    if (isSignedIn) { unlock('explore_events'); markPageVisited('events') }
  }, [isSignedIn, unlock, markPageVisited])

  if (loading || !isSignedIn) return null

  return <EventsPage />
}
