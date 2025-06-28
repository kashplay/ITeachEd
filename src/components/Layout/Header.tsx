import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Search, Bell, Menu, X, Moon, Sun } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../ui/Button'
import iteachedLogo from '../../assets/images/iteached-logo.svg'

export function Header() {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(true)

  const isLandingPage = location.pathname === '/'
  const isAuthPage = location.pathname.startsWith('/auth')

  // Navigate to landing page when user signs out
  React.useEffect(() => {
    if (!user && !location.pathname.startsWith('/auth') && location.pathname !== '/') {
      console.log('🔄 Header: User is null, navigating to landing page from:', location.pathname)
      navigate('/', { replace: true })
    }
  }, [user, navigate, location.pathname])

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

  if (isLandingPage) {
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
              <Button 
                variant="ghost" 
                size="sm"
                icon={darkMode ? Sun : Moon}
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? 'Light' : 'Dark'}
              </Button>
              {user ? (
                <Link to="/dashboard">
                  <Button variant="primary" size="sm">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Link to="/auth/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
              )}
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
              {user ? (
                <Link to="/dashboard" className="block">
                  <Button variant="primary" size="sm" className="w-full">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Link to="/auth/login" className="block">
                  <Button variant="outline" size="sm" className="w-full">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
    )
  }

  // Don't show header elements on auth pages
  if (isAuthPage) {
    return null
  }

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="flex items-center">
            <img 
              src={iteachedLogo} 
              alt="ITeachEd" 
              className="h-8"
            />
          </Link>

          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 border border-gray-700 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="text-gray-400 hover:text-white relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="relative group">
              <button className="flex items-center space-x-2 text-gray-300 hover:text-white">
                <div className="w-8 h-8 bg-gradient-to-r from-[#6244FF] to-[#FFAE2D] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.email?.[0]?.toUpperCase()}
                  </span>
                </div>
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="p-2">
                  <button 
                    onClick={handleSignOut}
                    className="w-full text-left px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}