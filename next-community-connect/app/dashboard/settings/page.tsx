'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import SettingsPage from '@/app/settings/page'

export default function DashboardSettingsPage() {
  const { isSignedIn, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isSignedIn) router.replace('/signin')
  }, [isSignedIn, loading, router])

  if (loading || !isSignedIn) return null

  return <SettingsPage />
}
