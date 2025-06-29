import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth()

  // If user is null, redirect immediately (regardless of loading state)
  if (!user) {
    return <Navigate to="/auth/login" replace />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  // Check if user needs to complete pre-evaluation
  if (user && (!profile || !profile.evaluation_completed)) {
    // If we're already on pre-evaluation page, don't redirect
    if (window.location.pathname === '/pre-evaluation') {
      return <>{children}</>
    }
    
    return <Navigate to="/pre-evaluation" replace />
  }

  return <>{children}</>
}