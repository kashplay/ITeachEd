import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
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
  const showSidebar = !isAuthPage && !isLandingPage

  return (
    <div className="min-h-screen bg-gray-950">
      {showSidebar && (
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
      )}
      
      <main className={`${showSidebar ? 'ml-20' : ''}`}>
        {children}
      </main>
      
      <AuthDebug />
    </div>
  )
}