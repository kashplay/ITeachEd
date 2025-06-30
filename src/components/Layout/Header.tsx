import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  LogOut
} from 'lucide-react'
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

  // Only render header on auth pages
  // Remove header from landing page and all protected pages (dashboard, learning, achievements, etc.)
  if (!isAuthPage) {
    return null
  }

  // For auth pages, show minimal header with just logo
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