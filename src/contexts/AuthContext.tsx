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
    let mounted = true

    const initializeAuth = async () => {
      try {
        console.log('🔄 AuthContext: Initializing auth...')
        
        // Set a maximum timeout for the entire initialization
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Auth initialization timeout')), 10000)
        })

        const authPromise = supabase.auth.getSession()

        const { data: { session }, error } = await Promise.race([
          authPromise,
          timeoutPromise
        ])
        
        if (!mounted) return
        
        if (error) {
          console.error('❌ AuthContext: Error getting session:', error)
          setLoading(false)
          return
        }
        
        console.log('✅ AuthContext: Session retrieved:', session ? 'Found' : 'None')
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          console.log('🔄 AuthContext: Fetching profile for user:', session.user.id)
          await fetchProfile(session.user.id)
        } else {
          console.log('ℹ️ AuthContext: No user session, skipping profile fetch')
          setLoading(false)
        }
      } catch (error) {
        console.error('❌ AuthContext: Exception during initialization:', error)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        
        console.log('🔄 AuthContext: Auth state changed:', event)
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
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      console.log('🔄 AuthContext: Fetching profile for user:', userId)
      
      // Add timeout to profile fetch to prevent hanging
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
      })

      const profilePromise = supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      const { data, error } = await Promise.race([
        profilePromise,
        timeoutPromise
      ])

      if (error && error.code !== 'PGRST116') {
        console.error('❌ AuthContext: Error fetching profile:', error)
        // Don't throw error, just set profile to null and continue
        setProfile(null)
      } else if (data) {
        console.log('✅ AuthContext: Profile fetched successfully')
        setProfile(data)
      } else {
        console.log('ℹ️ AuthContext: No profile found for user')
        setProfile(null)
      }
    } catch (error) {
      console.error('❌ AuthContext: Exception fetching profile:', error)
      setProfile(null)
    } finally {
      console.log('✅ AuthContext: Setting loading to false')
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
      setUser(null)
      setSession(null)
      setProfile(null)
      setLoading(false)
      
      const { error } = await supabase.auth.signOut({ scope: 'local' })
      
      return { error: error || null }
    } catch (exception) {
      console.error('Sign out exception:', exception)
      
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
      console.log('🔄 AuthContext: Updating profile with:', updates)
      
      // Simplify the update data to minimize chances of timeout
      const minimalUpdates = {
        ...updates,
        updated_at: new Date().toISOString()
      }
      
      // Direct upsert approach - simpler and more reliable
      const upsertData = {
        user_id: user.id,
        full_name: user.user_metadata?.full_name || '',
        ...minimalUpdates
      }
      
      // Set a reasonable timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Profile upsert timeout')), 5000)
      })
      
      const upsertPromise = supabase
        .from('user_profiles')
        .upsert(upsertData, { 
          onConflict: 'user_id',
          ignoreDuplicates: false
        })
        .select()
      
      const { data, error } = await Promise.race([upsertPromise, timeoutPromise])
      
      if (error) {
        console.error('❌ AuthContext: Profile upsert error:', error)
        throw error
      }
      
      console.log('✅ AuthContext: Profile updated successfully')
      
      // Update local profile state with the new data
      if (data && data.length > 0) {
        setProfile(data[0])
      } else {
        // If no data returned but operation succeeded, update local state with updates
        setProfile(prev => prev ? { ...prev, ...updates } : null)
      }
      
    } catch (error) {
      console.error('❌ AuthContext: Profile update exception:', error)
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