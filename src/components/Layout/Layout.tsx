import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { AuthDebug } from '../AuthDebug'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  
  const isAuthPage = location.pathname.startsWith('/auth')
  const isLandingPage = location.pathname === '/'
  const isDashboardPage = location.pathname === '/dashboard'
  const isLearningPage = location.pathname === '/learning'
  const isAchievementsPage = location.pathname === '/achievements'
  const isGuildsPage = location.pathname === '/guilds'
  const isJobsPage = location.pathname === '/jobs'
  const isSettingsPage = location.pathname === '/settings'
  
  const hasCustomHeader = isDashboardPage || isLearningPage || isAchievementsPage || isGuildsPage || isJobsPage || isSettingsPage
  const showSidebar = !isAuthPage && !isLandingPage && !hasCustomHeader

  return (
    <div className="min-h-screen bg-gray-950">
      {!hasCustomHeader && <Header />}
      
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
      
      <AuthDebug />
    </div>
  )
}