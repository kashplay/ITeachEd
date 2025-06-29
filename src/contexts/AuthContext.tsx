import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { UserProfile } from '../types'

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: UserProfile | null
  loading: boolean
  signUp: (email: string, password: string, fullName: string) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signInWithGoogle: () => Promise<any>
  signOut: () => Promise<{ error: any }>
  resetPassword: (email: string) => Promise<any>
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
        }
        
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          fetchProfile(session.user.id).catch(console.error)
        } else {
          setLoading(false)
        }
      } catch (error) {
        console.error('Exception getting session:', error)
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
          setLoading(false)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error)
      }

      if (data) {
        setProfile(data)
      } else {
        setProfile(null)
      }
      
      setLoading(false)
    } catch (error) {
      console.error('Exception fetching profile:', error)
      setProfile(null)
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      })
      
      return { data, error }
    } catch (error) {
      console.error('Sign up exception:', error)
      return { data: null, error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      return { data, error }
    } catch (error) {
      console.error('Sign in exception:', error)
      return { data: null, error }
    }
  }

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/pre-evaluation`
        }
      })
      
      return { data, error }
    } catch (error) {
      console.error('Google sign in exception:', error)
      return { data: null, error }
    }
  }

  const signOut = async () => {
    try {
      // Clear local state immediately
      setUser(null)
      setSession(null)
      setProfile(null)
      setLoading(false)
      
      // Clear any Supabase data from localStorage manually as a failsafe
      try {
        const keysToRemove = Object.keys(localStorage).filter(key => key.includes('supabase'))
        keysToRemove.forEach(key => {
          localStorage.removeItem(key)
        })
      } catch (localStorageError) {
        console.error('Could not clear localStorage:', localStorageError)
      }
      
      // Now try to sign out from Supabase
      const { error } = await supabase.auth.signOut({ scope: 'local' })
      
      return { error: error || null }
    } catch (exception) {
      console.error('Sign out exception:', exception)
      
      // Even if there's an error, clear local state
      setUser(null)
      setSession(null)
      setProfile(null)
      setLoading(false)
      return { error: exception }
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      
      return { data, error }
    } catch (error) {
      console.error('Reset password exception:', error)
      return { data: null, error }
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      throw new Error('No authenticated user')
    }

    try {
      // Prepare the profile data with all required fields
      const profileData = {
        user_id: user.id,
        ...updates
      }
      
      // Use upsert to handle both insert and update cases
      const { error } = await supabase
        .from('user_profiles')
        .upsert(profileData)
      
      if (error) {
        console.error('Profile update error:', error)
        throw error
      }
      
      // Update local profile state with the updates
      setProfile(prev => prev ? { ...prev, ...updates } : null)
      
    } catch (error) {
      console.error('Profile update exception:', error)
      throw error
    }
  }

  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}