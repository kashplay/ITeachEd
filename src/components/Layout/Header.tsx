import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Search, Bell, Menu, X } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../ui/Button'
import iteachedLogo from '../../assets/images/iteached-logo.svg'

export function Header() {
  const { user, signOut, loading } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isLandingPage = location.pathname === '/'
  const isAuthPage = location.pathname.startsWith('/auth')

  // Navigate to landing page when user signs out
  React.useEffect(() => {
    if (!user && !loading && !location.pathname.startsWith('/auth') && location.pathname !== '/') {
      console.log('🔄 Header: User is null, navigating to landing page from:', location.pathname)
      navigate('/', { replace: true })
    }
  }, [user, loading, navigate, location.pathname])

  const handleSignOut = async () => {
    try {
      console.log('🔓 Header: Sign out button clicked')
      const { error } = await signOut()
      if (error) {
        console.error('❌ Header: Sign out failed:', error)
        // Even if signOut fails, try to navigate manually
        navigate('/', { replace: true })
      } else {
        console.log('✅ Header: Sign out successful, waiting for navigation...')
      }
      // Navigation will be handled by useEffect when user becomes null
    } catch (error) {
      console.error('❌ Header: Sign out exception:', error)
      // Fallback navigation on error
      navigate('/', { replace: true })
    }
  }

  // Only render header on landing page and auth pages
  // Remove header from all protected pages (dashboard, learning, achievements, etc.)
  if (!isLandingPage && !isAuthPage) {
    return null
  }

  // For auth pages, show minimal header with just logo
  if (isAuthPage) {
    return (
      <div className="absolute top-6 left-6 z-10">
        <Link to="/" className="block hover:opacity-80 transition-opacity">
          <img 
            src={iteachedLogo} 
            alt="ITeachEd" 
            className="h-8"
          />
        </Link>
      </div>
    )
  }

  // For landing page, only show header if user is not authenticated and not loading
  if (isLandingPage) {
    // Don't show header during loading or if user is authenticated
    if (loading || user) {
      return null
    }

    return (
      <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <img 
                src={iteachedLogo} 
                alt="ITeachEd" 
                className="h-8"
              />
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              <Link to="/auth/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
            </div>

            <button
              className="md:hidden text-gray-300 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-900 border-t border-gray-800">
            <div className="px-4 py-6 space-y-4">
              <Link to="/auth/login" className="block">
                <Button variant="outline" size="sm" className="w-full">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>
    )
  }

  return null
}