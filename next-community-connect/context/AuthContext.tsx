'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type User = {
  id: string
  email?: string
}

type AuthContextType = {
  user: User | null
  isSignedIn: boolean
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const DEMO_JUDGE_USER: User = { id: 'demo-judge-001', email: 'judges@tsa.com' }
const DEMO_JUDGE_STORAGE_KEY = 'community-connect-demo-judge'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      const sessionUser = data.session?.user

      if (sessionUser) {
        localStorage.removeItem(DEMO_JUDGE_STORAGE_KEY)
        setUser({ id: sessionUser.id, email: sessionUser.email })
      } else if (localStorage.getItem(DEMO_JUDGE_STORAGE_KEY) === 'true') {
        setUser(DEMO_JUDGE_USER)
      }

      setLoading(false)
    }

    getSession()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user
      if (sessionUser) {
        localStorage.removeItem(DEMO_JUDGE_STORAGE_KEY)
        setUser({ id: sessionUser.id, email: sessionUser.email })
      } else if (localStorage.getItem(DEMO_JUDGE_STORAGE_KEY) === 'true') {
        setUser(DEMO_JUDGE_USER)
      } else {
        setUser(null)
      }
    })

    return () => { listener.subscription.unsubscribe() }
  }, [])

  const signIn = async (email: string, password: string) => {
    // Try real Supabase auth first
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (!error && data.user) {
      localStorage.removeItem(DEMO_JUDGE_STORAGE_KEY)
      setUser({ id: data.user.id, email: data.user.email })
      return
    }

    // Judge fallback: if Supabase auth fails for any reason, use demo session
    if (email === 'judges@tsa.com' && password === 'judges!') {
      localStorage.setItem(DEMO_JUDGE_STORAGE_KEY, 'true')
      setUser(DEMO_JUDGE_USER)
      return
    }

    // Surface real errors for all other accounts
    if (error) {
      if (error.message.toLowerCase().includes('email not confirmed')) {
        throw new Error('Account exists but email is not confirmed. For this demo, please create a new account.')
      }
      if (error.message.toLowerCase().includes('invalid login credentials')) {
        throw new Error('Invalid email or password.')
      }
      throw new Error(error.message)
    }
  }

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw new Error(error.message)
    const sessionUser = data.user
    if (sessionUser) {
      localStorage.removeItem(DEMO_JUDGE_STORAGE_KEY)
      setUser({ id: sessionUser.id, email: sessionUser.email })
    }
  }

  const signOut = async () => {
    if (user?.id === 'demo-judge-001') {
      localStorage.removeItem(DEMO_JUDGE_STORAGE_KEY)
      setUser(null)
      return
    }
    localStorage.removeItem(DEMO_JUDGE_STORAGE_KEY)
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isSignedIn: !!user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
