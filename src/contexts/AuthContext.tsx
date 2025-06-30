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
        
        // Get session with shorter timeout
        const sessionPromise = supabase.auth.getSession()
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Session fetch timeout')), 3000)
        })

        const { data: { session }, error } = await Promise.race([
          sessionPromise,
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
      
      // Create multiple timeout strategies
      const profilePromise = supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      // First try with 2 second timeout
      const quickTimeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Quick profile fetch timeout (2s)')), 2000)
      })

      let result
      try {
        result = await Promise.race([profilePromise, quickTimeoutPromise])
      } catch (quickError) {
        console.warn('⚠️ AuthContext: Quick fetch failed, trying with longer timeout...')
        
        // If quick fetch fails, try with longer timeout
        const longerTimeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Profile fetch timeout (8s)')), 8000)
        })

        try {
          result = await Promise.race([profilePromise, longerTimeoutPromise])
        } catch (longerError) {
          console.error('❌ AuthContext: Profile fetch failed with longer timeout:', longerError)
          
          // If both timeouts fail, try one more time with no timeout but set profile to null
          try {
            console.log('🔄 AuthContext: Attempting final profile fetch without timeout...')
            result = await profilePromise
          } catch (finalError) {
            console.error('❌ AuthContext: Final profile fetch failed:', finalError)
            setProfile(null)
            setLoading(false)
            return
          }
        }
      }

      const { data, error } = result

      if (error && error.code !== 'PGRST116') {
        console.error('❌ AuthContext: Error fetching profile:', error)
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
      
      // First, check if profile exists with timeout
      const checkPromise = supabase
        .from('user_profiles')
        .select('id, user_id')
        .eq('user_id', user.id)
        .single()

      const checkTimeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Profile check timeout')), 3000)
      })

      let existingProfile
      try {
        const { data, error } = await Promise.race([checkPromise, checkTimeoutPromise])
        if (error && error.code !== 'PGRST116') {
          console.error('❌ AuthContext: Error checking existing profile:', error)
          throw error
        }
        existingProfile = data
      } catch (error) {
        console.error('❌ AuthContext: Profile check failed:', error)
        // Continue with upsert anyway
        existingProfile = null
      }

      let result
      
      if (existingProfile) {
        // Profile exists, use UPDATE with timeout
        console.log('🔄 AuthContext: Profile exists, updating...')
        const updatePromise = supabase
          .from('user_profiles')
          .update(updates)
          .eq('user_id', user.id)
          .select()
          .single()

        const updateTimeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Profile update timeout')), 5000)
        })

        result = await Promise.race([updatePromise, updateTimeoutPromise])
      } else {
        // Profile doesn't exist, use INSERT with timeout
        console.log('🔄 AuthContext: Profile doesn\'t exist, creating...')
        const profileData = {
          user_id: user.id,
          full_name: user.user_metadata?.full_name || '',
          guild_level: 'ROOKIE',
          xp: 0,
          pathways_completed: 0,
          guild_rank: 999999,
          total_hours: 0,
          projects_completed: 0,
          ...updates
        }
        
        const insertPromise = supabase
          .from('user_profiles')
          .insert(profileData)
          .select()
          .single()

        const insertTimeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Profile insert timeout')), 5000)
        })

        result = await Promise.race([insertPromise, insertTimeoutPromise])
      }
      
      if (result.error) {
        console.error('❌ AuthContext: Profile operation error:', result.error)
        throw result.error
      }
      
      console.log('✅ AuthContext: Profile updated successfully')
      
      // Update local profile state
      setProfile(prev => prev ? { ...prev, ...updates } : result.data)
      
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