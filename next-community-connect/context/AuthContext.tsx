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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      const sessionUser = data.session?.user
      if (sessionUser) {
        setUser({ id: sessionUser.id, email: sessionUser.email })
      }
      setLoading(false)
    }

    getSession()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user
      setUser(sessionUser ? { id: sessionUser.id, email: sessionUser.email } : null)
    })

    return () => { listener.subscription.unsubscribe() }
  }, [])

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      if (error.message.toLowerCase().includes('email not confirmed')) {
        throw new Error('Account exists but email is not confirmed. For this demo, please create a new account.')
      }
      if (error.message.toLowerCase().includes('invalid login credentials')) {
        throw new Error('Invalid email or password.')
      }
      throw new Error(error.message)
    }

    await supabase.auth.refreshSession()
    const sessionUser = data.user
    if (sessionUser) {
      setUser({ id: sessionUser.id, email: sessionUser.email })
    }
  }

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw new Error(error.message)
    const sessionUser = data.user
    if (sessionUser) {
      setUser({ id: sessionUser.id, email: sessionUser.email })
    }
  }

  const signOut = async () => {
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
