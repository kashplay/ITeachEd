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
    
    // Get initial session with faster timeout
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        console.log('🔄 AuthContext: Got initial session', { session: !!session, error })
        
        if (error) {
          console.error('❌ Error getting session:', error)
        }
        
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          console.log('👤 AuthContext: User found, fetching profile...')
          // Don't await profile fetch to speed up initial load
          fetchProfile(session.user.id).catch(console.error)
        } else {
          console.log('👤 AuthContext: No user found')
        }
      } catch (error) {
        console.error('❌ Exception getting session:', error)
      } finally {
        setLoading(false)
        console.log('✅ AuthContext: Initial loading complete')
      }
    }

    initializeAuth()

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

    // Reduced timeout for faster initial load
    const timeoutId = setTimeout(() => {
      console.log('⚠️ AuthContext: Timeout reached, forcing loading to false')
      setLoading(false)
    }, 3000) // Reduced from 10 seconds to 3 seconds

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
          redirectTo: `${window.location.origin}/pre-evaluation`
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
      
      // Log current state before sign out
      console.log('🔓 Current auth state:', {
        hasUser: !!user,
        hasSession: !!session,
        hasProfile: !!profile,
        userId: user?.id,
        userEmail: user?.email
      })
      
      // Clear local state immediately to prevent loading state issues
      console.log('🔓 AuthContext: Clearing local auth state immediately...')
      setUser(null)
      setSession(null)
      setProfile(null)
      setLoading(false) // Set loading to false immediately after clearing user
      
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
      
      // Now try to sign out from Supabase (don't block UI on this)
      console.log('🔓 AuthContext: Calling supabase.auth.signOut...')
      const { error } = await supabase.auth.signOut({ scope: 'local' })
      
      if (error) {
        console.error('❌ AuthContext: Supabase sign out error:', error)
        console.error('❌ Error details:', {
          message: error.message,
          status: error.status
        })
        // Don't throw error, local cleanup is already done
      } else {
        console.log('✅ AuthContext: Supabase sign out successful')
      }
      
      console.log('✅ AuthContext: Sign out process complete')
      return { error: error || null }
    } catch (exception) {
      console.error('❌ AuthContext: Sign out exception:', exception)
      if (exception instanceof Error) {
        console.error('❌ Exception details:', {
          name: exception.name,
          message: exception.message,
          stack: exception.stack
        })
      }
      
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
    if (!user) {
      console.error('❌ updateProfile: No user found')
      throw new Error('No authenticated user')
    }

    try {
      console.log('🔄 updateProfile: Starting profile update for user:', user.id)
      console.log('🔄 updateProfile: Update data:', updates)
      
      // Prepare the data for upsert (always include defaults for new profiles)
      const profileData = {
        user_id: user.id,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        guild_level: 'ROOKIE',
        xp: 0,
        pathways_completed: 0,
        guild_rank: 999999,
        total_hours: 0,
        projects_completed: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...updates // Apply the updates on top of defaults
      }
      
      console.log('🔄 updateProfile: Profile data prepared for upsert')
      
      // Use direct upsert without fetching existing profile first
      console.log('🔄 updateProfile: Attempting direct upsert...')
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert(profileData, {
          onConflict: 'user_id'
        })
        .select()
        .single()

      if (error) {
        console.error('❌ updateProfile: Database error:', error)
        console.error('❌ updateProfile: Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw error
      }

      console.log('✅ updateProfile: Profile updated successfully:', data)
      
      // Update local state
      setProfile(data)
      
      console.log('✅ updateProfile: Profile update complete')
    } catch (error) {
      console.error('❌ updateProfile: Exception during profile update:', error)
      console.error('❌ updateProfile: User context:', {
        userId: user?.id,
        userEmail: user?.email,
        hasProfile: !!profile
      })
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
        
        // Immediate local cleanup - don't wait for API
        console.log('🔧 Clearing local state immediately...');
        setUser(null);
        setSession(null);
        setProfile(null);
        
        // Clear storage immediately
        try {
          localStorage.clear();
          sessionStorage.clear();
          console.log('🔧 Storage cleared');
        } catch (error) {
          console.error('🔧 Storage clear error:', error);
        }
        
        // Try API calls with timeout, but don't block
        const signOutWithTimeout = async (method: () => Promise<any>, timeout = 3000) => {
          return Promise.race([
            method(),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Timeout')), timeout)
            )
          ]);
        };
        
        try {
          console.log('🔧 Attempting API sign out (with timeout)...');
          await signOutWithTimeout(() => supabase.auth.signOut({ scope: 'local' }));
          console.log('🔧 API sign out successful');
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.warn('🔧 API sign out failed/timeout:', errorMessage);
        }
        
        // Force reload regardless
        setTimeout(() => {
          console.log('🔧 Force reloading page...');
          window.location.reload();
        }, 100);
      },
      
      immediateSignOut() {
        console.log('🔧 Immediate Sign Out - NO API CALLS, LOCAL ONLY');
        
        // Clear all local state immediately
        setUser(null);
        setSession(null);
        setProfile(null);
        setLoading(false);
        
        // Clear all storage
        localStorage.clear();
        sessionStorage.clear();
        
        // Clear cookies
        document.cookie.split(";").forEach(function(c) { 
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
        });
        
        console.log('🔧 Immediate sign out complete - reloading page...');
        
        // Force reload after a tiny delay
        setTimeout(() => window.location.href = '/', 50);
        
        return { error: null };
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
       },
       
       async testNetworkConnectivity() {
         console.log('🌐 Testing Supabase connectivity...');
         try {
           const start = Date.now();
           const { data, error } = await supabase.auth.getSession();
           const duration = Date.now() - start;
           
           console.log('🌐 Network test result:', {
             success: !error,
             duration: `${duration}ms`,
             hasSession: !!data.session,
             error: error?.message
           });
           
           if (duration > 10000) {
             console.warn('🌐 SLOW NETWORK: Request took over 10 seconds');
           }
           
           return { success: !error, duration, error };
         } catch (error) {
           console.error('🌐 Network test failed:', error);
           return { success: false, error };
         }
       }
    };
    
    console.log('🔧 Auth debugging utilities available:', {
      'debugAuth.checkAuthState()': 'Check current auth state',
      'debugAuth.immediateSignOut()': 'INSTANT sign out (no API calls)',
      'debugAuth.forceSignOut()': 'Force complete sign out with timeout',
      'debugAuth.alternativeSignOut()': 'Try alternative sign out method',
      'debugAuth.testSignOut()': 'Test sign out process',
      'debugAuth.testNetworkConnectivity()': 'Test Supabase API connectivity'
    });
  }, [value, user, session, profile, loading, signOut])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}