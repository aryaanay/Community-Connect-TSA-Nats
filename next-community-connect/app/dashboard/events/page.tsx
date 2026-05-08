'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import EventsPage from '@/app/events/page'

export default function DashboardEventsPage() {
  const { isSignedIn, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isSignedIn) router.replace('/signin')
  }, [isSignedIn, loading, router])

  if (loading || !isSignedIn) return null

  return <EventsPage />
}
