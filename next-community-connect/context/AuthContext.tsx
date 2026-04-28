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
const DEMO_JUDGE_USER: User = {
  id: 'demo-judge-001',
  email: 'judges@tsa.com',
}
const DEMO_JUDGE_STORAGE_KEY = 'community-connect-demo-judge'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // 🔄 Get current session on load
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      const sessionUser = data.session?.user

      if (sessionUser) {
        localStorage.removeItem(DEMO_JUDGE_STORAGE_KEY)
        setUser({
          id: sessionUser.id,
          email: sessionUser.email,
        })
      } else if (localStorage.getItem(DEMO_JUDGE_STORAGE_KEY) === 'true') {
        setUser(DEMO_JUDGE_USER)
      }

      setLoading(false)
    }

    getSession()

    // 🔄 Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const sessionUser = session?.user

        if (sessionUser) {
          localStorage.removeItem(DEMO_JUDGE_STORAGE_KEY)
          setUser({
            id: sessionUser.id,
            email: sessionUser.email,
          })
        } else if (localStorage.getItem(DEMO_JUDGE_STORAGE_KEY) === 'true') {
          setUser(DEMO_JUDGE_USER)
        } else {
          setUser(null)
        }
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  // 🔐 SIGN IN
  const signIn = async (email: string, password: string) => {
    // Demo account bypass - works without Supabase user
    if (email === 'judges@tsa.com' && password === 'judges!') {
      localStorage.setItem(DEMO_JUDGE_STORAGE_KEY, 'true')
      setUser(DEMO_JUDGE_USER)
      return
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      if (error.message.toLowerCase().includes('email not confirmed')) {
        throw new Error(
          'Account exists but email is not confirmed. For this demo, please create a new account.'
        )
      }

      if (error.message.toLowerCase().includes('invalid login credentials')) {
        throw new Error('Invalid email or password.')
      }

      throw new Error(error.message)
    }

    // 🔄 Ensure session is fresh
    await supabase.auth.refreshSession()
    localStorage.removeItem(DEMO_JUDGE_STORAGE_KEY)

    const sessionUser = data.user
    if (sessionUser) {
      localStorage.removeItem(DEMO_JUDGE_STORAGE_KEY)
      setUser({
        id: sessionUser.id,
        email: sessionUser.email,
      })
    }
  }

  // 🆕 SIGN UP
  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      throw new Error(error.message)
    }

    // If email confirm is OFF → user is instantly usable
    const sessionUser = data.user
    if (sessionUser) {
      localStorage.removeItem(DEMO_JUDGE_STORAGE_KEY)
      setUser({
        id: sessionUser.id,
        email: sessionUser.email,
      })
    }
  }

  // 🚪 SIGN OUT
  const signOut = async () => {
    // Handle demo user sign out
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
    <AuthContext.Provider
      value={{
        user,
        isSignedIn: !!user,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// 🔌 Hook
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
