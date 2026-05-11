'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/dashboard')
      } else {
        // Exchange the code in the URL for a session
        const { hash, search } = window.location
        const params = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : search)
        const accessToken = params.get('access_token')
        const refreshToken = params.get('refresh_token')

        if (accessToken && refreshToken) {
          supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
            .then(() => router.replace('/dashboard'))
            .catch(() => router.replace('/signin'))
        } else {
          // PKCE flow — Supabase handles automatically on session check
          router.replace('/dashboard')
        }
      }
    })
  }, [router])

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(145deg, #010f1f 0%, #022040 100%)' }}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
        <p className="font-outfit text-sm" style={{ color: 'rgba(198,235,255,0.55)' }}>
          Signing you in…
        </p>
      </div>
    </div>
  )
}
