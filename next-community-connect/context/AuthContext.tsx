'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type User = {
  id: string
  email?: string
  displayName?: string
}

type AuthContextType = {
  user: User | null
  isSignedIn: boolean
  loading: boolean
  signIn: (email: string, password: string) => Promise<User>
  signUp: (email: string, password: string, displayName: string) => Promise<User>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const DEMO_JUDGE_USER: User = { id: 'demo-judge-001', email: 'judges@tsa.com', displayName: 'TSA Judge' }
const DEMO_JUDGE_STORAGE_KEY = 'community-connect-demo-judge'

function mapSupabaseUser(sessionUser: { id: string; email?: string; user_metadata?: Record<string, any> }): User {
  const displayName =
    sessionUser.user_metadata?.display_name ||
    sessionUser.user_metadata?.full_name ||
    sessionUser.user_metadata?.name

  return {
    id: sessionUser.id,
    email: sessionUser.email,
    displayName: typeof displayName === 'string' ? displayName : undefined,
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      const sessionUser = data.session?.user

      if (sessionUser) {
        localStorage.removeItem(DEMO_JUDGE_STORAGE_KEY)
        setUser(mapSupabaseUser(sessionUser))
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
        setUser(mapSupabaseUser(sessionUser))
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
      const signedInUser = mapSupabaseUser(data.user)
      setUser(signedInUser)
      return signedInUser
    }

    // Judge fallback: if Supabase auth fails for any reason, use demo session
    if (email === 'judges@tsa.com' && password === 'judges!') {
      localStorage.setItem(DEMO_JUDGE_STORAGE_KEY, 'true')
      setUser(DEMO_JUDGE_USER)
      return DEMO_JUDGE_USER
    }

    // Surface real errors for all other accounts
    if (error) {
      if (error.message.toLowerCase().includes('email not confirmed')) {
        throw new Error('Account exists but email is not confirmed. For this demo, please confirm your email or use the judges account.')
      }
      if (error.message.toLowerCase().includes('invalid login credentials')) {
        throw new Error('Invalid email or password.')
      }
      throw new Error(error.message)
    }

    throw new Error('Sign in failed. Please try again.')
  }

  const signUp = async (email: string, password: string, displayName: string) => {
    const cleanDisplayName = displayName.trim()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: cleanDisplayName,
          full_name: cleanDisplayName,
        },
      },
    })
    if (error) throw new Error(error.message)
    const sessionUser = data.user
    if (sessionUser) {
      localStorage.removeItem(DEMO_JUDGE_STORAGE_KEY)
      const newUser = mapSupabaseUser(sessionUser)
      setUser(newUser)
      return newUser
    }
    return { id: 'pending-verification', email, displayName: cleanDisplayName }
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
