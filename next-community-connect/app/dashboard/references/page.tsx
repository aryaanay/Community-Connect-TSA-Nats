'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useAchievements } from '@/context/AchievementsContext'
import ReferencesPage from '@/app/references/page'

export default function DashboardReferencesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { markPageVisited } = useAchievements()

  useEffect(() => {
    if (!loading && !user) router.push('/signin')
  }, [user, loading, router])

  useEffect(() => { markPageVisited('references') }, [markPageVisited])

  if (loading || !user) return null

  return <ReferencesPage />
}
