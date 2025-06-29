import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth()
  const [timeoutReached, setTimeoutReached] = useState(false)

  useEffect(() => {
    // Reset timeout reached when loading state changes
    setTimeoutReached(false)
    
    // Don't set timeout if user is null or not loading
    if (!loading || !user) {
      return
    }

    // If loading takes too long, show an error and redirect
    const timeout = setTimeout(() => {
      if (loading && user) { // Only timeout if still loading AND user exists
        console.error('⚠️ ProtectedRoute: Auth loading timeout reached')
        setTimeoutReached(true)
      }
    }, 15000) // 15 second timeout

    return () => clearTimeout(timeout)
  }, [loading, user])

  // If user is null, redirect immediately (regardless of loading state)
  if (!user) {
    console.log('🔄 ProtectedRoute: No user found, redirecting to login')
    return <Navigate to="/auth/login" replace />
  }

  if (timeoutReached) {
    console.log('🔄 ProtectedRoute: Timeout reached, redirecting to login')
    return <Navigate to="/auth/login" replace />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your dashboard...</p>
          {import.meta.env.DEV && (
            <p className="text-xs text-gray-500 mt-2">Check console for auth debug info</p>
          )}
        </div>
      </div>
    )
  }

  // Check if user needs to complete pre-evaluation
  if (user && (!profile || !profile.evaluation_completed)) {
    // If we're already on pre-evaluation page, don't redirect
    if (window.location.pathname === '/pre-evaluation') {
      console.log('✅ ProtectedRoute: User on pre-evaluation page, rendering content')
      return <>{children}</>
    }
    
    console.log('🔄 ProtectedRoute: User needs pre-evaluation, redirecting')
    return <Navigate to="/pre-evaluation" replace />
  }

  console.log('✅ ProtectedRoute: User authenticated and evaluated, rendering protected content')
  return <>{children}</>
}