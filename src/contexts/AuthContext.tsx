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
    console.log('🔄 AuthContext: Initializing auth state...')
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('🔄 AuthContext: Got initial session', { session: !!session, error })
      if (error) {
        console.error('❌ Error getting session:', error)
      }
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        console.log('👤 AuthContext: User found, fetching profile...')
        fetchProfile(session.user.id)
      } else {
        console.log('👤 AuthContext: No user found')
      }
      setLoading(false)
      console.log('✅ AuthContext: Initial loading complete')
    }).catch((error) => {
      console.error('❌ Exception getting session:', error)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.email)
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          // Clear profile when user signs out
          setProfile(null)
        }
        
        setLoading(false)
        console.log('✅ AuthContext: Auth state change processed')
      }
    )

    // Failsafe: Ensure loading state resolves even if there are issues
    const timeoutId = setTimeout(() => {
      console.log('⚠️ AuthContext: Timeout reached, forcing loading to false')
      setLoading(false)
    }, 10000) // 10 second timeout

    return () => {
      clearTimeout(timeoutId)
      subscription.unsubscribe()
    }
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      console.log('🔄 AuthContext: Fetching profile for user:', userId)
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Error fetching profile:', error)
        // Don't throw error, just log it and continue
      }

      if (data) {
        console.log('✅ AuthContext: Profile fetched successfully')
        setProfile(data)
      } else {
        console.log('ℹ️ AuthContext: No profile found, user can continue without profile')
        setProfile(null)
      }
    } catch (error) {
      console.error('❌ Exception fetching profile:', error)
      setProfile(null) // Set to null on error so user can still continue
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
      console.log('🔓 AuthContext: Starting sign out process...')
      console.log('🔓 Environment:', {
        isDev: import.meta.env.DEV,
        mode: import.meta.env.MODE,
        baseUrl: import.meta.env.BASE_URL,
        origin: window.location.origin
      })
      
      setLoading(true)
      
      // Log current state before sign out
      console.log('🔓 Current auth state:', {
        hasUser: !!user,
        hasSession: !!session,
        hasProfile: !!profile,
        userId: user?.id,
        userEmail: user?.email
      })
      
      // Check localStorage before sign out
      const lsKeys = Object.keys(localStorage).filter(key => key.includes('supabase'))
      console.log('🔓 localStorage keys before signOut:', lsKeys)
      
      // First, try to sign out from Supabase
      console.log('🔓 AuthContext: Calling supabase.auth.signOut...')
      const { error } = await supabase.auth.signOut({ scope: 'local' })
      
      if (error) {
        console.error('❌ AuthContext: Supabase sign out error:', error)
        console.error('❌ Error details:', {
          message: error.message,
          status: error.status,
          statusText: error.statusText
        })
        // Continue with local cleanup even if Supabase fails
      } else {
        console.log('✅ AuthContext: Supabase sign out successful')
      }
      
      // Clear local state immediately to ensure UI updates
      console.log('🔓 AuthContext: Clearing local auth state...')
      setUser(null)
      setSession(null)
      setProfile(null)
      
      // Clear any Supabase data from localStorage manually as a failsafe
      try {
        const keysToRemove = Object.keys(localStorage).filter(key => key.includes('supabase'))
        keysToRemove.forEach(key => {
          console.log('🔓 Removing localStorage key:', key)
          localStorage.removeItem(key)
        })
        console.log('🔓 AuthContext: Cleared localStorage keys:', keysToRemove)
      } catch (localStorageError) {
        console.error('⚠️ AuthContext: Could not clear localStorage:', localStorageError)
      }
      
      // Verify state after cleanup
      console.log('🔓 State after cleanup:', {
        hasUser: !!user,
        hasSession: !!session,
        hasProfile: !!profile
      })
      
      // Check if auth state actually changed
      const { data: currentSession } = await supabase.auth.getSession()
      console.log('🔓 Current session after signOut:', {
        hasSession: !!currentSession.session,
        sessionUser: currentSession.session?.user?.email
      })
      
      setLoading(false)
      console.log('✅ AuthContext: Sign out process complete')
      
      return { error: error || null }
    } catch (exception) {
      console.error('❌ AuthContext: Sign out exception:', exception)
      console.error('❌ Exception details:', {
        name: exception.name,
        message: exception.message,
        stack: exception.stack
      })
      
      // Even if there's an error, clear local state to ensure user can't stay logged in
      setUser(null)
      setSession(null)
      setProfile(null)
      setLoading(false)
      return { error: exception }
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

  // Expose auth context for debugging
  React.useEffect(() => {
    (window as any).testAuthContext = value;
    
    // Production debugging utilities
    (window as any).debugAuth = {
      async checkAuthState() {
        console.log('🔍 Auth Debug - Current State:', {
          user: !!user,
          session: !!session,
          profile: !!profile,
          loading,
          userId: user?.id,
          userEmail: user?.email,
          environment: {
            isDev: import.meta.env.DEV,
            mode: import.meta.env.MODE,
            origin: window.location.origin
          }
        });
        
        const { data: sessionData } = await supabase.auth.getSession();
        console.log('🔍 Supabase Session:', {
          hasSession: !!sessionData.session,
          sessionUserId: sessionData.session?.user?.id,
          sessionUserEmail: sessionData.session?.user?.email
        });
        
        const lsKeys = Object.keys(localStorage).filter(key => key.includes('supabase'));
        console.log('🔍 LocalStorage Keys:', lsKeys);
        
        if (user) {
          try {
            const { data: profileData, error } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('user_id', user.id)
              .single();
            
            console.log('🔍 Profile Check:', {
              hasProfile: !!profileData,
              profileError: error?.message,
              profileData: profileData ? 'exists' : 'none'
            });
          } catch (error) {
            console.log('🔍 Profile Check Error:', error);
          }
        }
      },
      
      async forceSignOut() {
        console.log('🔧 Force Sign Out - Starting...');
        try {
          // Multiple sign out approaches
          await supabase.auth.signOut({ scope: 'global' });
          await supabase.auth.signOut({ scope: 'local' });
          await supabase.auth.signOut();
          
          // Clear all local storage
          localStorage.clear();
          sessionStorage.clear();
          
          // Force reload
          window.location.reload();
        } catch (error) {
          console.error('🔧 Force Sign Out Error:', error);
        }
      },
      
      async alternativeSignOut() {
        console.log('🔧 Alternative Sign Out - Starting...');
        try {
          // Try global scope first
          console.log('🔧 Trying global scope...');
          await supabase.auth.signOut({ scope: 'global' });
          
          // Wait a bit
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Clear state manually
          setUser(null);
          setSession(null);
          setProfile(null);
          
          // Clear cookies if they exist
          document.cookie.split(";").forEach(function(c) { 
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
          });
          
          console.log('🔧 Alternative sign out complete');
          return { error: null };
        } catch (error) {
          console.error('🔧 Alternative Sign Out Error:', error);
          return { error };
        }
      },
      
      async testSignOut() {
        console.log('🧪 Testing Sign Out Process...');
        await this.checkAuthState();
        console.log('🧪 Calling signOut...');
        const result = await signOut();
        console.log('🧪 Sign out result:', result);
        setTimeout(() => {
          console.log('🧪 State after 1 second:');
          this.checkAuthState();
        }, 1000);
      }
    };
    
    console.log('🔧 Auth debugging utilities available:', {
      'debugAuth.checkAuthState()': 'Check current auth state',
      'debugAuth.forceSignOut()': 'Force complete sign out',
      'debugAuth.alternativeSignOut()': 'Try alternative sign out method',
      'debugAuth.testSignOut()': 'Test sign out process'
    });
  }, [value, user, session, profile, loading, signOut])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}