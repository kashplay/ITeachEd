import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const [timeoutReached, setTimeoutReached] = useState(false)

  useEffect(() => {
    // If loading takes too long, show an error and redirect
    const timeout = setTimeout(() => {
      if (loading) {
        console.error('⚠️ ProtectedRoute: Auth loading timeout reached')
        setTimeoutReached(true)
      }
    }, 15000) // 15 second timeout

    return () => clearTimeout(timeout)
  }, [loading])

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

  if (!user) {
    console.log('🔄 ProtectedRoute: No user found, redirecting to login')
    return <Navigate to="/auth/login" replace />
  }

  console.log('✅ ProtectedRoute: User authenticated, rendering protected content')
  return <>{children}</>
}