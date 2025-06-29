import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { useAuth } from '../../contexts/AuthContext'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const { loading } = useAuth()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  
  const isAuthPage = location.pathname.startsWith('/auth')
  const isLandingPage = location.pathname === '/'
  const isPreEvaluationPage = location.pathname === '/pre-evaluation'
  const isOnboardingPage = location.pathname === '/onboarding'
  const isProtectedPage = !isAuthPage && !isLandingPage && !isPreEvaluationPage && !isOnboardingPage

  // Show sidebar only on protected pages (dashboard, learning, achievements, etc.)
  // Exclude pre-evaluation and onboarding pages
  const showSidebar = isProtectedPage

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header component now handles its own rendering logic */}
      <Header />
      
      <div className="flex">
        {showSidebar && (
          <Sidebar 
            collapsed={sidebarCollapsed} 
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
          />
        )}
        
        <main className={`flex-1 ${showSidebar ? 'ml-0' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  )
}