import React from 'react'
import { useAuth } from '../contexts/AuthContext'

export function AuthDebug() {
  const { user, session, profile, loading } = useAuth()

  // Only show in development
  if (!import.meta.env.DEV) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 border border-gray-600 rounded-lg p-3 text-xs text-white max-w-xs z-50">
      <div className="font-bold mb-2">🔧 Auth Debug</div>
      <div className="space-y-1">
        <div>Loading: <span className={loading ? 'text-yellow-400' : 'text-green-400'}>{loading ? 'true' : 'false'}</span></div>
        <div>User: <span className={user ? 'text-green-400' : 'text-red-400'}>{user ? 'authenticated' : 'null'}</span></div>
        <div>Session: <span className={session ? 'text-green-400' : 'text-red-400'}>{session ? 'exists' : 'null'}</span></div>
        <div>Profile: <span className={profile ? 'text-green-400' : 'text-gray-400'}>{profile ? 'loaded' : 'null'}</span></div>
        {user && (
          <div className="text-gray-300 break-all">
            Email: {user.email}
          </div>
        )}
      </div>
    </div>
  )
} 