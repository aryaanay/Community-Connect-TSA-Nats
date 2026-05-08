'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import ResourcesPage from '@/app/resources/page'

export default function DashboardResourcesPage() {
  const { isSignedIn, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isSignedIn) router.replace('/signin')
  }, [isSignedIn, loading, router])

  if (loading || !isSignedIn) return null

  return <ResourcesPage />
}
