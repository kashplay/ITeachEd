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
  const showSidebar = !isAuthPage && !isLandingPage && !isDashboardPage

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      
      <div className="flex">
        {showSidebar && (
          <Sidebar 
            collapsed={sidebarCollapsed} 
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
          />
        )}
        
        <main className={`flex-1 ${showSidebar ? 'ml-[88px]' : ''} ${isDashboardPage ? 'ml-[88px]' : ''}`}>
          {children}
        </main>
      </div>
      
      <AuthDebug />
    </div>
  )
}