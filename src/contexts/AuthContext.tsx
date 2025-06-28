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
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error)
      }
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          // Clear profile when user signs out
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
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
        throw error
      }

      if (data) {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      console.log('Attempting to sign up with:', email)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      })
      
      if (error) {
        console.error('Sign up error:', error)
      } else {
        console.log('Sign up successful:', data)
      }
      
      return { data, error }
    } catch (error) {
      console.error('Sign up exception:', error)
      return { data: null, error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in with:', email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        console.error('Sign in error:', error)
      } else {
        console.log('Sign in successful:', data)
      }
      
      return { data, error }
    } catch (error) {
      console.error('Sign in exception:', error)
      return { data: null, error }
    }
  }

  const signInWithGoogle = async () => {
    try {
      console.log('Attempting Google sign in')
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      })
      
      if (error) {
        console.error('Google sign in error:', error)
      } else {
        console.log('Google sign in initiated:', data)
      }
      
      return { data, error }
    } catch (error) {
      console.error('Google sign in exception:', error)
      return { data: null, error }
    }
  }

  const signOut = async () => {
    try {
      console.log('Signing out')
      setLoading(true)
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut({ scope: 'local' })
      
      if (error) {
        console.error('Sign out error:', error)
        setLoading(false)
        return { error }
      }
      
      // Clear local state immediately to ensure UI updates
      setUser(null)
      setSession(null)
      setProfile(null)
      
      console.log('Sign out successful')
      setLoading(false)
      return { error: null }
    } catch (error) {
      console.error('Sign out exception:', error)
      // Even if there's an error, clear local state
      setUser(null)
      setSession(null)
      setProfile(null)
      setLoading(false)
      return { error }
    }
  }

  const resetPassword = async (email: string) => {
    try {
      console.log('Resetting password for:', email)
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      
      if (error) {
        console.error('Reset password error:', error)
      } else {
        console.log('Reset password email sent:', data)
      }
      
      return { data, error }
    } catch (error) {
      console.error('Reset password exception:', error)
      return { data: null, error }
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return

    try {
      console.log('Updating profile:', updates)
      const { error } = await supabase
        .from('user_profiles')
        .upsert({ 
          user_id: user.id, 
          ...updates,
          updated_at: new Date().toISOString()
        })

      if (error) {
        console.error('Update profile error:', error)
        throw error
      }

      setProfile(prev => prev ? { ...prev, ...updates } : null)
      console.log('Profile updated successfully')
    } catch (error) {
      console.error('Error updating profile:', error)
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